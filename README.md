# matthewkeil.com

## Project setup
AWS will be used for this project and there are two ways to provide credentials for use by this repo.  First is to setup for AWS config file using the instructions found [here]().  The second, good when using credentials for many different accounts will be to setup a `.env` file with the following two keys.  The `.env` is not tracked by git so it will not get uploaded to the remote repo.  Place your accessKey and secretAccessKey between the parenthesis `...='value goes here'`.  Make sure the there are not spaces around the `=` as `AWS_ACCESS_KEY_ID = 'kjdhg21hjnegh'` will throw an error.
```
AWS_ACCESS_KEY_ID=''
AWS_SECRET_ACCESS_KEY=''
```

Next you will need to enter the following information into the CONFIG.ts file.
```typescript
export const CONFIG = {
    ROOT_DOMAIN: 'example.com', // this should be the  naked domain without the 'www'
    OWNER: 'gitHubAccountName',
    REPO: 'gitHubRepoName',
    REGION: 'us-east-1' // or region you prefer to deploy to.
}
```

---

## Set-up of Hosted Zone and SSL certificate for https hosting
There are a couple of steps to setting up the DNS records and the SSL certificate that will cover your website.  It is mostly automated however there are a few steps you will need to manually complete during the process.

1) `npm run deploy nocert` should be run from the root of the repo.  This will deploy the HostedZone so that you can update your domain provider (ie GoDaddy or domains.google.com) to look to amazon's Route53 service. Once the stack is created go to the Route53 page and click on hosted zones. Then click on the one with the name that you set in the `CONFIG.ROOT_DOMAIN`.  Find the four name servers listed in the value field, next the `NS` type record.  Make a note of these four values as you will need to enter them into the name server field of your domain hosting company.

2) Go to the website where you registerd your domain and look for the name server configuration.  Enter those four name servers from above as the name servers for your domain. Before you will be able to get an SSL cert your name servers need to be configured and it may take up to 48 hours for the changes to occur with some providers.

3) `npm run deploy` from the root of the repo. This will start the process of getting an SSL certificate by updating the root stack you deployed above.  Once you run this command and the update begins you will need to go to the Cloudformaion page on the Aws console and find the 