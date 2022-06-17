import { Context } from 'aws-lambda';
import { S3Example } from '/opt/nodejs/node_modules/layer-example'


const region = process.env.REGION ?? 'us-east-1'

export async function handler(event: any, context: Context) {
    console.log(event)
    console.log(context)

    const s3 = new S3Example(region)

    console.log(s3)

    console.log(s3.getAllBucketNames())
}