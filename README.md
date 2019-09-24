# Devops for Digital Nomads and Start-Ups

## Setup
We are going to create a `.env` file with our configuration.  Follow the directions below and you will be able to fill out the following values. These are your private passwords. The `.gitignore` is set to not commit the `.env` but its worth explicitly stating these potentially have full access to your accounts, so protect them as such. Do not store commit them to GitHub or be all willy nilly with them silly.  As you create them add them to the `.env` file as shown below.  They are usually only shown once on-screen so note them before you close the respective windows they are shown on.
```bash
AWS_ACCESS_KEY_ID='xxxxxxxxxxxxxxxxxxxx'
AWS_SECRET_ACCESS_KEY='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
GITHUB_ACCESS_TOKEN='xxxxxxxxxxxxxxxxxxxx'
GITHUB_SSH_KEYS='xxxxxxxxxxxxxxxxxxxx'
REGION='us-east-1'
```
Devops for Digiat Nomads and Startups makes use of the AWS CLI, you can get instructions to [install it here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html).  After that is instaleld you can find details to configure it by following [this link](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

We need to create a [GitHub Personal Access Token](https://github.com/settings/tokens), to allow AWS to access webhooks for our devops pipeline. You can find the OAUTH under GitHub profile->Settings->Developer Settings->[Personal Access Tokens](https://github.com/settings/tokens). Click Generate New Token and name it something related to AWS so you know what its for.  Then set the scope to only allow 'repo' and 'admin:repo_hook'.

Next [make SSH keys](https://help.github.com/en/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) for the build process to download the code and then [add them to your account](https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account).


## Install packages

```
npm install
```

## Lambda Environtment Variables

The following environment variables are available to all lambda functions.  They can be accessed as normal on `process.env`.

```typescript
process.env.REGION
process.env.DYNAMO_TABLE_NAME
process.env.DB_NAME
process.env.DB_CLUSTER_ADDRESS
process.env.DB_PORT
process.env.DB_USERNAME
process.env.DB_PASSWORD
```

## Build and Deploy

```
npm run deploy
```
