# About delegatedauth
A simple Node.js web application configured for [Heroku](https://www.heroku.com/) that implements the **delegated authentication** SOAP web service from Salesforce.

#What is Delegated Authentication?
Single Sign On with Salesforce as the service provider requires an infrastructure with an identity provider that either implements standard interface using SAML (called Federated Authentication) or exposes the identity service using a SOAP based API - which is called Delegated Authentication. See this article [Single Sign-On with SAML on Force.com] (https://developer.salesforce.com/page/Single_Sign-On_with_SAML_on_Force.com) to understand the concepts and how to implement your own identity provider.
This sample covers the Delegated Authentication and implements a sample SOAP web service using Node.js technology.
It can be easily deployed to Heroku. Read the instructions below how to install and run the sample.

The Salesforce documentation describes delegated authentication in more detail.
Check this doc: [Configuring Salesforce for Delegated Authentication](https://help.salesforce.com/HTViewHelpDoc?id=sso_delauthentication_configuring.htm&language=en_US)

#Installation

To run this example with your own Salesforce org, you need to contact Salesforce to enable delegated authentication single sign-on.

##Clone locally and run Heroku

Assumes you have configured your local environment with the [Heroku Toolbelt](https://toolbelt.heroku.com/)

Open a terminal window and start typing... (output of each command omitted)

    git clone https://github.com/rdonato/delegatedauth.git
    cd delegatedauth
    heroku login
    heroku create
    git push heroku master
    heroku scale web=1
    heroku logs --tail
    
##OR: Use the simple Deploy to Heroku button

Here is a friendly Heroku button. It will create into Heroku for you.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


#How to use
Once your Salesforce org has Delegated Authentication enabled, all you need to do is enter the URL of your new web service in the Delegated Gateway URL text box.
Remember the Heroku application name and the URL - in this example *sheltered-dusk-90723*:

    $ heroku create
    Creating app... done, stack is cedar-14
    https://sheltered-dusk-90723.herokuapp.com/ | https://git.heroku.com/sheltered-dusk-90723.git

Your new web service has the following endpoint 

    https://sheltered-dusk-90723.herokuapp.com/SforceAuthenticationService
    
You should set the above endpoint insede Salesforce Delegated Auth configuration page.

#How it works
The login logic of this sample service is very easy. As long as the first part of username (till the @ character) and password are equal the service returns with true and the login is successful. Otherwise the service returns false and the login fails.
To validate the results you can easily check the logs by opening the Heroku app homepage and see the log table including call details.

Sample SOAP request envelope:
```
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:authentication.soap.sforce.com">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:Authenticate>
         <urn:username>tegeling@salesforce.com</urn:username>
         <urn:password>tegeling@salesforce.com</urn:password>
      </urn:Authenticate>
   </soapenv:Body>
</soapenv:Envelope>
```
Sample SOAP response envelope:
```
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="urn:authentication.soap.sforce.com">
   <soap:Body>
      <AuthenticateResult xmlns="urn:authentication.soap.sforce.com">
         <Authenticated>true</Authenticated>
      </AuthenticateResult>
   </soap:Body>
</soap:Envelope>
```
