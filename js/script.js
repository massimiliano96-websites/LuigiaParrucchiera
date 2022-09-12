$(function () {
    // Same as document.querySelector("#navbarToggle").addEventListener("blur)
    $("#navbarToggle").blur(function (event) {
        let screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $("#collapsable-nav").collapse('hide');
        }
    });
    // In Firefox and Safari, the click event doesn't retain the focus
    // on the clicked button. Therefore, the blur event will not fire on
    // user clicking somewhere else in the page and the blur event handler
    // which is set up above will not be called.
    // Refer to issue #28 in the repo.
    // Solution: force focus on the element that the click event fired on
    $("#navbarToggle").click(function (event) {
        $(event.target).focus();
    });
});

(function(global) {
    let lp = {};
    let homeHtml = "snippets/home-snippet.html";
    let allServicesUrl = "data/services.json";
    let servicesTitleHtml = "snippets/services-title-snippet.html";
    let serviceHtml = "snippets/service-snippet.html";

    // Convenience function for inserting innerHTML for 'select'
    let insertHtml = function (selector, html) {
        let targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    let showLoading = function (selector) {
        let html = "<div class='text-center'>";
        html += "<img src='images/loading.gif'></div>";
        insertHtml(selector, html);
    };

    // Return substitute of '{{propName}}' with propValue in given 'string'
    let insertProperty = function (string, propName, propValue) {
        let propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    }

    // On page load, show home view
    document.addEventListener("DOMContentLoaded", function (event){
       // On first load, show home view
       showLoading("#main-content");
       $ajaxUtils.sendGetRequest(
           homeHtml,
           function (responseText) {
               document.querySelector("#main-content").innerHTML = responseText;
           },
          false);
    });

    lp.loadServices = function ()  {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allServicesUrl, buildAndShowServicesHMTL);
    }

    //Build HTML for the services page based on the data from the json
    function buildAndShowServicesHMTL(services) {
        // Load title snippet of service page
        $ajaxUtils.sendGetRequest(
            servicesTitleHtml,
            function (servicesTitleHtml) {
                // Retrieve single service snippet
                $ajaxUtils.sendGetRequest(
                    serviceHtml,
                    function (serviceHtml) {
                        let servicesViewHtml = buildServicesVienHtml(services, servicesTitleHtml, serviceHtml);
                        insertHtml("#main-content", servicesViewHtml);
                    },
                    false);
                },
            false);
    }

    //Using categories data and snippets html build services view HTML to be inserted into page
    function buildServicesVienHtml(services, servicesTitleHtml, serviceHtml){
        let finalHtml = servicesTitleHtml;
        finalHtml += "<div class=\"background-image img-responsive\"><img src=\"images/logo_transparent.png\">"
        finalHtml += "<section class='row'>";

        //Loop over services
        for(let i = 0; i < services.length; i++) {
            //Insert service values
            let html = serviceHtml;
            let name = "" + services[i].name;
            let short_name = services[i].short_name;
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHtml += html;
        }

        finalHtml += "</section></div>"
        return finalHtml;
    }

    global.$lp = lp;

})(window);