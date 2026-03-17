import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as path from "path";

export class Ec2RebootStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda 실행 역할 생성
    const lambdaRole = new iam.Role(this, "Ec2RebootLambdaRole", {
      roleName: "ec2-reboot-lambda-role",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
    });

    // EC2 재부팅 권한 추가
    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["ec2:RebootInstances"],
        resources: [
          `arn:aws:ec2:ap-northeast-2:*:instance/i-03b6df64b273de01b`,
        ],
      })
    );

    // Lambda 함수 생성
    const rebootFn = new lambda.Function(this, "Ec2RebootFunction", {
      functionName: "ec2-reboot-function",
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "handler.handler",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../../lambda")
      ),
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
      description: "EC2 인스턴스 재부팅 Lambda 함수",
    });

    // 출력
    new cdk.CfnOutput(this, "FunctionName", {
      value: rebootFn.functionName,
      description: "Lambda 함수명",
    });

    new cdk.CfnOutput(this, "FunctionArn", {
      value: rebootFn.functionArn,
      description: "Lambda 함수 ARN",
    });
  }
}
