const https = require('https');

async function getCurrentIP() {
  return new Promise((resolve, reject) => {
    https.get('https://xxxxxxxxx', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const ip = JSON.parse(data).ip;
          resolve(ip);
        } catch (error) {
          reject(new Error('Error parsing IP response'));
        }
      });
    }).on('error', (error) => {
      reject(new Error('Error getting IP: ' + error.message));
    });
  });
}

async function connectToFirewall(ip) {
  const firewallEndpoint = 'https://firewall-api.com/connect';
  const apiKey = 'your-api-key';

  const postData = JSON.stringify({ ip });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    },
  };

  const req = https.request(firewallEndpoint, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Connected to firewall:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error connecting to firewall:', error.message);
  });

  req.write(postData);
  req.end();
}

async function main() {
  try {
    const currentIP = await getCurrentIP();
    console.log('Current IP:', currentIP);

    if (currentIP) {
      await connectToFirewall(currentIP);
    }
  } catch (error) {
    console.error(error.message);
  }
}

main();
