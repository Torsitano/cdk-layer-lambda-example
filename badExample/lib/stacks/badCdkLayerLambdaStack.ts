import { Duration, Stack, StackProps } from 'aws-cdk-lib'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs'


export class CdkLayerLambdaStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);


        const badLayer = new LayerVersion(this, 'BadLayer', {
            compatibleRuntimes: [
                Runtime.NODEJS_16_X
            ],
            compatibleArchitectures: [
                Architecture.X86_64
            ],
            code: Code.fromAsset('src/layer/nodejs')
        })

        const layerExampleLambda = new NodejsFunction(this, 'BadLayerExampleLambda', {
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
                badLayer
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
