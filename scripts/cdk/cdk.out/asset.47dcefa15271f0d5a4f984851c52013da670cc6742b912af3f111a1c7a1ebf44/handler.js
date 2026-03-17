const { EC2Client, RebootInstancesCommand } = require("@aws-sdk/client-ec2");

const INSTANCE_ID = "i-03b6df64b273de01b";
const REGION = "ap-northeast-2";

exports.handler = async (event) => {
  const client = new EC2Client({ region: REGION });
  const command = new RebootInstancesCommand({
    InstanceIds: [INSTANCE_ID],
  });

  try {
    await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Instance ${INSTANCE_ID} reboot initiated`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
