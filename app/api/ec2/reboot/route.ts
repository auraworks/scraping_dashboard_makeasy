import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { EC2Client, RebootInstancesCommand } from "@aws-sdk/client-ec2";
import { NextResponse } from "next/server";

const FUNCTION_NAME = "ec2-reboot-function";
const INSTANCE_ID = "i-03b6df64b273de01b";
const REGION = "ap-northeast-2";

export async function POST() {
  const accessKey = process.env.NEXT_PUBLIC_IAM_ACCESS_KEY;
  const secretKey = process.env.NEXT_PUBLIC_IAM_SECRET_ACCESS_KEY;

  if (!accessKey || !secretKey) {
    return NextResponse.json(
      { success: false, error: "AWS credentials not configured" },
      { status: 500 }
    );
  }

  const credentials = { accessKeyId: accessKey, secretAccessKey: secretKey };

  // Lambda 함수가 배포된 경우 Lambda를 통해 재부팅
  try {
    const lambdaClient = new LambdaClient({ region: REGION, credentials });
    const invokeResult = await lambdaClient.send(
      new InvokeCommand({
        FunctionName: FUNCTION_NAME,
        InvocationType: "RequestResponse",
      })
    );

    const payload = invokeResult.Payload
      ? JSON.parse(Buffer.from(invokeResult.Payload).toString())
      : null;

    if (invokeResult.FunctionError) {
      throw new Error(payload?.errorMessage || "Lambda invocation failed");
    }

    const body = payload?.body ? JSON.parse(payload.body) : payload;
    return NextResponse.json({
      success: true,
      message: `Lambda를 통해 인스턴스 ${INSTANCE_ID} 재부팅이 시작되었습니다.`,
      via: "lambda",
      detail: body,
    });
  } catch (lambdaError: unknown) {
    const isNotFound =
      lambdaError instanceof Error &&
      (lambdaError.message.includes("Function not found") ||
        lambdaError.message.includes("ResourceNotFoundException"));

    if (!isNotFound) {
      return NextResponse.json(
        {
          success: false,
          error: lambdaError instanceof Error ? lambdaError.message : "Lambda 호출 실패",
        },
        { status: 500 }
      );
    }

    // Lambda 미배포 시 EC2 직접 호출 (fallback)
    try {
      const ec2Client = new EC2Client({ region: REGION, credentials });
      await ec2Client.send(
        new RebootInstancesCommand({ InstanceIds: [INSTANCE_ID] })
      );
      return NextResponse.json({
        success: true,
        message: `인스턴스 ${INSTANCE_ID} 재부팅이 시작되었습니다. (Lambda 미배포 - 직접 호출)`,
        via: "direct",
      });
    } catch (ec2Error) {
      return NextResponse.json(
        {
          success: false,
          error: ec2Error instanceof Error ? ec2Error.message : "EC2 재부팅 실패",
        },
        { status: 500 }
      );
    }
  }
}
