# Nomad-Devops
So you're building this great project... Now to get it online securely, cheaply, easily and quickly.  Not as easy as it sounds once you start looking at hosting options and scalability.  How about getting an SSL certificate to serve your page over https? How about making sure there is low latency around the world? Edge caching, much and yet more setup to handle.

For low traffic websites it can be very expensive to host on wordpress, heroku or a dedicated server with a dedicated domain name option.  When first starting, and in many other cases, that is WAY overkill on the wallet.  What about deploying a new version to show a client without a huge amount of headache or funky url? Professionalism is key in obtaining and retaining the best clients.  Afterall you strive to be the best freelancer you can, right?

This is where utilizing others understanding of ops and devops becomes super critical. [You are welcome, and can ask me questions if you need a hand.](https://www.linkedin.com/in/matthew-keil/) Getting online quickly without the headaches by simply using `npm run deploy` to stand a stack, or `npm run deploy devops` to stand a pipeline that deploys each commit to that same stack. Thats what the big guys do and now you can too. Deploying a feature branch is as easy as...
```
git branch -b new-feature
git commit -m "shiny new feature"
npm run deploy client
```
Five minutes later you are approaching your client and saying hey check out your new feature on... `https://feature-branch.nomad.house` where `feature-branch` is autoconfigured from the branch name you used in git. Slick... Smooth... Sexy... awww yea!

And the price tag for that sexiness? $0.90\month for hosting the domain with less than 100,000 requests a month accross all subdomains. [Yes, really.](https://aws.amazon.com/route53/pricing/)  Unless you get to a ton of traffic the front-end hosting and edge caching will most likely fall under the free tier. [Yes, really.](https://aws.amazon.com/s3/pricing/)  How about your backend?  Ahh, the joys of serverless, and yes, that is probably going to be free for you also if you are low on traffic (less than 1,000,000 request/month).  [Yes, really.](https://aws.amazon.com/lambda/pricing/) and more of [Yes, really.](https://aws.amazon.com/api-gateway/pricing/) And the cost for a devops pipeline that lasts less than a month? That is free. [Yes, really.](https://aws.amazon.com/codepipeline/pricing/). And what about that build server to do your pipeline builds? Well you guessed it. If you are doing less than 100min/month of build thats free too. [Yes, really.](https://aws.amazon.com/codebuild/pricing)

Everyone loves FREE. As Oprah says... **You get free hosting! You get free hosting! And you get free hosting! Everyone gets free hosting....**

---

## Project Configuration
This project was built using TypeScript but if you are using JavaScript that is no problem.  If you can `npm run ___` nomad-devops is for you.  

Configuration is quite straighforward.  Open the `config.ts` file and fill out the following 4 fields.  Currently nomad-devops is only compatable with Github.
```typescript
export const CONFIG = {
    ROOT_DOMAIN: 'example.com', // this should be the  naked domain without the 'www'
    OWNER: 'gitHubAccountName', // this is the name of the repo owner: 'www.github.com/ownerName'
    REPO: 'gitHubRepoName', // this is the repo name: 'www.github.com/ownerName/repoName'
    REGION: 'us-east-1' // or region you prefer to deploy to.
}
```

## Credentials Setup
As you create the keys that are discusse in this section add them to the `.env` file as shown below.  They are usually only shown once on-screen so note them before you close the respective windows they are shown on. Nomad-Devops makes use of the AWS CLI, you can get instructions to [install it here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).  After that is installed you can find details to configure it by following [this link](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html). You will need to generate a set of AWS access tokens following the instructions listed [on this page](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html), under the heading **Managing Access Keys (Console)**.  We also need to create a [GitHub Personal Access Token](https://github.com/settings/tokens), to allow the deploy script to access your repos to validate branch names. You can find the OAUTH under GitHub profile->Settings->Developer Settings->[Personal Access Tokens](https://github.com/settings/tokens). Click Generate New Token and name it something related to AWS so you know what its for.  Then set the scope to only allow 'repo' and 'admin:repo_hook'.

These are private keys and should be treated like all passwords.  To **protect** them we are going to create a `.env` file to store our **private information**.  Follow the directions below and you will be able to fill out the following values. These are your **private passwords**. The `.gitignore` is set to not commit the `.env` but its worth explicitly stating these potentially have full access to your accounts, so protect them as such. **Do not commit them.**

NOTE: no spaces may be included in any of the keys, so `AWS_ACCESS_KEY_ID = 'xxxxxxxxxxxxxxxxxxxx'` throws an error. 

```bash
AWS_ACCESS_KEY_ID='xxxxxxxxxxxxxxxxxxxx'
AWS_SECRET_ACCESS_KEY='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
GITHUB_ACCESS_TOKEN='xxxxxxxxxxxxxxxxxxxx'
```

When using AWS there are actually many ways to provide credentials to the sdk. Credentials can be located in the `$HOME/.aws/credentials` file or in the `.env` file like implemented in this repo. If you only work with one AWS account it can be convenient to put your credentials in the `$HOME/.aws/credentials` file and you can find information [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) on how to set that up.  If you work with many accounts, as digital nomads can have many clients, it can be easier to put the tokens for your client account in its respective repo so that those are used.  The AWS-SDK is setup to use whatever credentials are used by the calling function if present, and if none are supplied the sdk falls back to using the credentials found in the `$HOME/.aws/credentials` file. Nomad-Devops implements sdk calls like the example below such that it will use the values found in your `.env` if they are present.  If not the value will be `undefined` and the sdk will fallback to use the `[default]` values found in your `$HOME/.aws/credentials`.
```typescript
const CF = new AWS.CloudFormation({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
```
---

## Set-up of Hosted Zone and SSL certificate for https hosting
There are a couple of steps to setting up the DNS records and the SSL certificate that will cover your website.  It is mostly automated however there are a few steps you will need to manually complete during the process.

1) `npm run deploy nocert` should be run from the root of the repo.  This will deploy the HostedZone so that you can update your domain provider (ie GoDaddy or domains.google.com) to look to amazon's Route53 service. Once the stack is created go to the Route53 page and click on hosted zones. Then click on the one with the name that you set in the `CONFIG.ROOT_DOMAIN`.  Find the four name servers listed in the value field, next the `NS` type record.  Make a note of these four values as you will need to enter them into the name server field of your domain hosting company.

2) Go to the website where you registerd your domain and look for the name server configuration.  Enter those four name servers from above as the name servers for your domain. Before you will be able to get an SSL cert your name servers need to be configured and it may take up to 48 hours for the changes to occur with some providers.

3) `npm run deploy` from the root of the repo. This will start the process of getting an SSL certificate by updating the root stack you deployed above.  Once you run this command and the update begins you will need to go to the Cloudformaion page on the Aws console and find the 