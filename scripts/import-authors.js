import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// 환경 변수 로드
config({ path: path.join(__dirname, "..", ".env.local") });

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL 또는 Service Role Key가 설정되지 않았습니다.");
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL와 SUPABASE_SERVICE_ROLE_KEY 환경변수를 설정해주세요.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// JSON 파일 읽기
const authorsFilePath = path.join(__dirname, "..", "작가_db.json");
const authorsData = JSON.parse(fs.readFileSync(authorsFilePath, "utf8"));

// request_status enum 타입 확인
async function getRequestStatusEnum() {
  const { error } = await supabase
    .from("authors")
    .select("request_status")
    .limit(1);

  if (error) {
    console.error("request_status enum 조회 실패:", error);
    return "pending"; // 기본값
  }

  return "pending"; // 기본값으로 설정
}

// 데이터 변환 함수
function transformAuthor(author) {
  return {
    author_name: author["작가(한글)"] || "",
    author_name_en: author["작가(영어/원어)"] || null,
    keyword: [], // 빈 배열로 초기화
    description: "", // 필수값이므로 빈 문자열
    featured_work: "대표작 미등록", // 기본값
    is_visible: false, // 기본값
    request_status: "pending", // author_request_status enum 값
    is_deleted: false, // 기본값
  };
}

// 메인 함수
async function importAuthors() {
  console.log(`${authorsData.length}명의 작가 데이터를 가져왔습니다.`);

  const requestStatus = await getRequestStatusEnum();
  console.log(`request_status 기본값: ${requestStatus}`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // 배치 처리 (한 번에 100개씩)
  const batchSize = 100;
  for (let i = 0; i < authorsData.length; i += batchSize) {
    const batch = authorsData.slice(i, i + batchSize);
    const transformedBatch = batch.map(transformAuthor);

    for (const author of transformedBatch) {
      try {
        // 중복 확인
        const { data: existing } = await supabase
          .from("authors")
          .select("id")
          .eq("author_name", author.author_name)
          .single();

        if (existing) {
          console.log(`이미 존재하는 작가: ${author.author_name}`);
          continue;
        }

        // 삽입
        const { error } = await supabase
          .from("authors")
          .insert([author])
          .select();

        if (error) {
          console.error(`삽입 실패 (${author.author_name}):`, error.message);
          errors.push({ author: author.author_name, error: error.message });
          errorCount++;
        } else {
          console.log(`삽입 성공: ${author.author_name}`);
          successCount++;
        }
      } catch (err) {
        console.error(`처리 중 오류 (${author.author_name}):`, err.message);
        errors.push({ author: author.author_name, error: err.message });
        errorCount++;
      }
    }

    // 잠시 대기 (API 제한 방지)
    if (i + batchSize < authorsData.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log("\n=== 가져오기 결과 ===");
  console.log(`성공: ${successCount}건`);
  console.log(`실패: ${errorCount}건`);

  if (errors.length > 0) {
    console.log("\n=== 오류 목록 ===");
    errors.forEach(({ author, error }) => {
      console.log(`${author}: ${error}`);
    });
  }
}

// 실행
importAuthors()
  .then(() => {
    console.log("가져오기 완료!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("가져오기 중 오류 발생:", err);
    process.exit(1);
  });
