// node --env-file=workspace/.env workspace/r2.mjs

import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { createReadStream } from 'fs';

const fileStream = createReadStream('./workspace/us.fgb');

const client = new S3Client({
	region: 'auto',
	endpoint: process.env.R2_ENDPOINT,
	credentials: {
		accessKeyId: process.env.ACCESS_KEY_ID,
		secretAccessKey: process.env.SECRET_ACCESS_KEY
	}
});

const parallelUpload = new Upload({
	client: client,
	params: {
		Bucket: process.env.R2_BUCKET,
		Key: process.env.R2_KEY,
		Body: fileStream
	},
	// Optional configuration
	queueSize: 4, // Concurrent parts
	partSize: 1024 * 1024 * 5 // 5 MB minimum part size
});

parallelUpload.on('httpUploadProgress', (progress) => {
	console.log(`Uploaded ${progress.loaded} out of ${progress.total} bytes`);
});

await parallelUpload.done();
