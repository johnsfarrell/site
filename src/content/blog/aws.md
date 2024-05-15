---
title: "Domains on AWS"
description: "Deploying a Namecheap domain to GitHub Pages and a subdomain to an EC2 instance using AWS Route 53."
pubDate: "May 15, 2024"
---

**Deploying a Namecheap domain to GitHub Pages and a subdomain to an EC2 instance using AWS Route 53.**

This is my experience deploying a domain and subdomain on AWS Route 53. Recently, [I was working on a project](https://rgbit.io) that required deploying a website to a domain, and an API to a subdomain. I wanted to use AWS Route 53 to manage the DNS records for the domain and subdomain.

<hr>

## Prerequisites

Before we get started, you'll need to have the following:

1. A domain purchased from [Namecheap](https://www.namecheap.com/)
2. An [AWS EC2 instance](https://aws.amazon.com/pm/ec2) running an API server
3. A [GitHub Pages](https://pages.github.com/) repository running a website

Once you have these prerequisites, you can follow the steps below to deploy your domain and subdomain on AWS Route 53.

## Step 1: Create a Hosted Zone

1. Navigate to the [AWS Management Console](https://aws.amazon.com/console/) and sign in.
2. In the search bar, type "Route 53" and select the Route 53 service.
3. Click on "Hosted zones" in the left-hand menu.
4. Click on "Create hosted zone".
5. Enter your domain name (e.g., `example.com`) and click "Create hosted zone".

## Step 2: Creating Record Sets for GitHub Pages

First we will create a record set for the root domain that points to GitHub Pages.

1. Click on the hosted zone you just created.
2. Click on "Create record set".
3. Leave the "Name" field blank to create a record set for the root domain.
4. Select "A - IPv4 address" for the "Type" field.
5. In the "Value" field, enter the IP addresses below. These are the IP addresses for GitHub Pages.

   > `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

6. Click "Create" to create the record set.

Next, we will create a CNAME record set for the `www` subdomain that also points to GitHub Pages.

1. Click on "Create record set".
2. Enter `www` in the "Name" field.
3. Select "CNAME - Canonical name" for the "Type" field.
4. In the "Value" field, enter your GitHub Pages URL (e.g., `username.github.io`).
5. Click "Create" to create the record set.

## Step 3: Creating Record Sets for the EC2 Instance

Now we will create a record set for the subdomain that points to the EC2 instance.

1. Click on "Create record set".
2. Enter the subdomain name (e.g., `api`) in the "Name" field.
3. Select "A - IPv4 address" for the "Type" field.
4. In the "Value" field, enter the public IP address of your EC2 instance. You can find this in the EC2 console.
5. Click "Create" to create the record set.

## Step 4: SSL Certification for EC2 Instance

We will now want to make sure our domain is HTTPS secure. To do this, we will use Caddy to reverse proxy our EC2 instance.

1. SSH into your EC2 instance.
2. Install Caddy by running the following commands:

   ```bash
   sudo apt update
   sudo apt install caddy
   ```

3. Create a Caddyfile in the `/etc/caddy` directory with the following configuration:

   ```bash
    api.example.com {
         reverse_proxy localhost:3000
    }
   ```

   **Be sure to replace `api.example.com` with your subdomain and `localhost:3000` with the address of your API server.**

4. Restart Caddy to apply the changes:

   ```bash
    sudo systemctl restart caddy
   ```

## Step 5: Update Namecheap DNS Servers

Finally, you will need to update the DNS servers on Namecheap to point to the AWS Route 53 name servers.

1. In the AWS Route 53 console, click on the hosted zone you created.
2. Copy the four name servers listed under "Name servers", or `NS` records. These will look something like:

   > `ns-13.awsdns-2.com.`, `ns-35.awsdns-4.net.`, `ns-57.awsdns-6.org.`, `ns-79.awsdns-8.co.uk.`

3. Log in to your Namecheap account and navigate to the domain management page.
4. Click on "Domain" in the left-hand menu and select your domain.
5. Click on "Nameservers" and select "Custom DNS".
6. Paste the AWS Route 53 name servers into the four fields provided.
7. Click the checkmark to save the changes.

## Step 6: Troubleshooting

It can take time for the steps above to take effect. If you encounter any issues, here are some common troubleshooting steps:

### Domain Not Connecting to GitHub Pages

If your domain is not connecting to GitHub Pages, make sure you have created a CNAME file in your GitHub Pages repository with your domain name (e.g., `example.com`).

```bash
echo "example.com" > CNAME
```

Another common issue is not setting the `homepage` field in your `package.json` file to your GitHub Pages URL. For example:

```json
"homepage": "https://username.github.io/repo-name"
```

And, be sure to run `npm run deploy` to deploy your site to GitHub Pages.

### CNAME Conflict Error

If you encounter a CNAME conflict error when creating the record set for the `www` subdomain, you may need to delete any existing CNAME records for the `www` subdomain in the hosted zone.

### DNS Propagation

It may take some time for the DNS changes to propagate. You can use tools like [DNS Checker](https://dnschecker.org/) to check the status of your DNS records. It may take up to 48 hours for the changes to fully propagate.

## More Resources

- [AWS Route 53 Documentation](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Namecheap Documentation](https://www.namecheap.com/support/knowledgebase/)
- [Caddy Documentation](https://caddyserver.com/docs)
- [DNS Checker](https://dnschecker.org/)
- [EC2 Documentation](https://docs.aws.amazon.com/ec2/index.html)
- [GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
