const axios = require('axios');
const FormDataa = require('form-data');
const fs = require('fs');
const JWT =
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    .eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3ZDQ0NThhYi1iNmE5LTQ1ZWMtYmFkMi1lMDc4MTg4YjFjNmUiLCJlbWFpbCI6Im1laG1ldC5zZW5ndW4xQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1NDFkNDA3ODQ1NDE0YjZhMGFkNSIsInNjb3BlZEtleVNlY3JldCI6Ijk1Y2U1ODYyZTA0MzcyNWUwYzA1NzA2Njk3YzdmMGQ1NDlmMjg0NGQzNzgyYTYyMzZlOTA4Y2RiYjU5NTQ3MWIiLCJpYXQiOjE3MTAwNTE4Njl9
    .TQRQBLDse17bqBapWYE49DftSbINgRT8ulcpkVaObPI;

const pinFileToIPFS = async () => {
  const formData = new FormDataa();
  const src = 'path/to/file.png';

  const file = fs.createReadStream(src);
  formData.append('file', file);

  const pinataMetadata = JSON.stringify({
    name: 'File name',
  });
  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', pinataOptions);

  try {
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
pinFileToIPFS();

//IIy4EJduHMb5aS3pIUa6FRKEAEVw62Aj8IfSjjizuRm5UE62CkknZQuK_C5dC6bU
//https://sapphire-past-leopon-885.mypinata.cloud/{CID}?pinataGatewayToken={Gateway API Key}

//curl 'https://sapphire-past-leopon-885.mypinata.cloud/ipfs/QmPyCYfL5oF79cfXjbt5cyr5hAZcyNrPNV9ytvUPdk8KT9?pinataGatewayToken=IIy4EJduHMb5aS3pIUa6FRKEAEVw62Aj8IfSjjizuRm5UE62CkknZQuK_C5dC6bU'
