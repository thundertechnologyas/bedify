# Bedify Guest Tools

Here, you'll find a collection of guest tools designed specifically for hotel owners to enhance the guest experience. Currently, this includes an embeddable booking engine, with plans to introduce a guest self-service portal in the near future. 

We have made this set of tools open source so that developers can help improve the guest-tools and even get a better insight into making their own applications on top of the Bedify Eco System.

## Bedify Account
You will need an bedify account in order to get the guest tools up and running, head over to https://bedify.net to get your account. Once you have an account you can go to Bedify -> Settings and create an BookingEngine. You would need the tenantId and BookingEngineId in order to have yourself a complete test environment.

## Get Started

1. Clone the repository
2.  run `ng serve --port 5000`. 
3. Open your fav browser and head to http://localhost:5000/{tenantId}/{bookingEngineId}

## Embed Into WordPress Page

First you need to have a code snippet added to your webpage, then  you can add custom html code to get the Bookingengine.

1. Install plugin "Code Snippets"
2. Go to Settings -> Sippets -> Add New

Name it "Bedify Embeddeable Booking Engine" and add the following content

```
function embed_bookingengine_assets() {
    // Check if we are on the "bookingengine" page
    if (is_page('bookingengine')) { // Replace 'bookingengine' with the slug or ID of your page
        ?>
        <!-- Include CSS -->
        <link rel="stylesheet" href="https://embedded.bedify.net/styles.css">

        <!-- Include Scripts -->
        <script src="https://unpkg.com/@webcomponents/custom-elements@latest/custom-elements.min.js"></script>
        <script src="https://unpkg.com/zone.js"></script>
        <script type="module" src="https://embedded.bedify.net/polyfills.js" defer></script>
        <script type="module" src="https://embedded.bedify.net/main.js" defer></script>
        <script src="https://kit.fontawesome.com/8ade590d6c.js" crossorigin="anonymous"></script>

        <!-- Add Inline Styles -->
        <style>
            .bedify-header-outer {
                padding-top: 30px !important;
                padding-bottom: 0px !important;
            }
            
            .bedify-header-inner {
                margin-bottom: 30px !important;
                border-radius: 5px;
                background-color: #F6F6F6;
            }

            .bedify-content-inner {
                background-color: #F6F6F6;
                padding: 20px;
                border-radius: 5px;
            }

            .bedify-button {
                background-color: #2569ad;
                color: #FFF;
            }
        </style>
        <?php
    }
}
```

Modify the style as you see fit and also make sure your pagename is set properly.

4. Now navigate to your page and add the following into your page block as "Custom html". Make sure to replace the tenantId and bookingEngineId with the ones you got from bedify.

```
<bedify-header 
   successurl="https://bedify.net/bookingengine/?paymentstatus=success",
   failedurl="https://bedify.net/bookingengine/?paymentstatus=failed",
   configs='[
       { "tenantId" : "{tenantId}", "bookingEngineId": "{bookingEngineId}", "name" : "Testhotel" }
   ]'>
</bedify-header>
<bedify-content></bedify-content>
```

## Completely standalone
Have a look at src/standalone-example.html and src/standalone-header-example.html on how to integrate it directly into other pages.

## Further help

We are eager to help you, please contact us at https://bedify.net
