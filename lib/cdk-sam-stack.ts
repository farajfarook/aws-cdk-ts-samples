import { Stack, Construct, StackProps } from "@aws-cdk/core"
import { Bucket } from "@aws-cdk/aws-s3"
import * as apigw from "@aws-cdk/aws-apigateway"
import * as lambda from "@aws-cdk/aws-lambda"
import * as path from "path"
import * as iam from "@aws-cdk/aws-iam"

export class CdkSamStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        let bkt = Bucket.fromBucketName(this, "tyst-buck", "tyst-buck-xx");

        if (bkt == null)
            new Bucket(this, "tyst-buck", {
                versioned: false,
                bucketName: "tyst-buck-xx"
            })

        let api = new apigw.RestApi(this, "test-api123-xx", {
            restApiName: "Test API 123",
            deployOptions: {
                stageName: "v1"
            }
        })

        api.root.addMethod('ANY')

        let apisam = api.root.addResource("apisam")

        let apisam_lambda = new lambda.Function(this, "apisam-lambda", {
            code: lambda.Code.fromAsset(path.join(__dirname, '..', 'archive.zip')),
            handler: 'ApiSam::ApiSam.LambdaEntryPoint::FunctionHandlerAsync',
            runtime: lambda.Runtime.DOTNET_CORE_2_1,
            role: iam.Role.fromRoleArn(this, "lambda-basic", "arn:aws:iam::xxx:role/lambda-basic")
        });

        let apisamproxy = apisam.addProxy({
            defaultIntegration: new apigw.LambdaIntegration(apisam_lambda),
        })
    }
}
