When a new clinic is onboarded, the following steps should be taken to ensure a smooth integration into our system and services:

dentdigital.no/clinic-name-tilbud is created as a landing page for advertisement. It is a landing page with form same as gdts.no/tilbud
When this form is filled it goes to a new google sheets which populates all the terms. Now question is how we should automatically do using either my personal account? 
Once this form is filled then a email is generated to clinic email and also the google sheet is updated which looks like Leads-{ Clinic name }-dentdigital. I have a sample file in repo for this google sheets file. 
Also when a clinic is onboarded, we need to create a landing page for this clinic as dentdigital.no/{ short random 7 digit link}. This will be used for tilbakemlding just like gdts.no/tilbakemelding. When user gives one to 4 ratings, it send an email to clinic email notifying them instantly. Also a new colun in google sheet is populated with bad review. If user clicks 5 rating then it is prompted to give review on google. 
When a new clinic is onboarded, a new oage dentdigital.no/{clinic name tannlegevakt} is created. This page is used gor google ads landing page for tannlegevakt advertisement. 

I am also attaching a repo from gdts.no where i have implemented this for your reference. Please check the repo and let me know if you have any questions.