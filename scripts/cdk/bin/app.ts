import * as cdk from "aws-cdk-lib";
import { Ec2RebootStack } from "../lib/ec2-reboot-stack";

const app = new cdk.App();

new Ec2RebootStack(app, "Ec2RebootStack", {
  env: {
    region: "ap-northeast-2",
  },
});
