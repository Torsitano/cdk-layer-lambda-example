import { Duration, Stack, StackProps } from 'aws-cdk-lib'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs'


export class CdkLayerLambdaStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const layerExampleLambda = new NodejsFunction(this, 'LayerExampleLambda', {
            entry: './src/lambda/handler.ts',
            handler: 'handler',
            runtime: Runtime.NODEJS_16_X,
            environment: {
                REGION: 'us-east-1'
            },
            timeout: Duration.seconds(15),
            memorySize: 128,
            bundling: {
                sourceMap: true,
                externalModules: [
                    'aws-sdk',
                    'layer-example'
                ]               
            },
            layers: [
                LayerVersion.fromLayerVersionArn(this, 'CdkLayerExample', 'arn:aws:lambda:us-east-1:698852667105:layer:TsCdkLayerExample:1')
            ]
        })

        layerExampleLambda.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: [
                    's3:ListAllMyBuckets'
                ],
                resources: ['*']
            })
        )
        
    }
}
