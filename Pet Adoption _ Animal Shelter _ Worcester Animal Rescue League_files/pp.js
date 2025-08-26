var pp_globals = {
    sortOrder: 1,
    intialNumTiles: 24  // placeholder 
};


jQuery(document).ready(function () {

    pp_globals.intialNumTiles = jQuery('.pp_tile_container').attr('numtiles');

    if (jQuery('.pp_hidden_tile').length > 0) {
        var count = jQuery('.pp_shown_tile').length;
        jQuery('#pp_numshowntiles').html("Showing " + count + " of ");
        jQuery('#show_more_tiles').show();
    }

    /*
        Lightbox effect for detail page
    */
    if (typeof cPhoto1 !== 'undefined') 
    {
        var images = [];

        if (cPhoto1.trim() !== '') {
            images.push(cPhoto1);
        }
        if (cPhoto2.trim() !== '') {
            images.push(cPhoto2);
        }
        if (cPhoto3.trim() !== '') {
            images.push(cPhoto3);
        }

        var currentIndex = 0;

        function showImage(index) {
            jQuery('#pp_lightboxImg').attr('src', images[index]);
            currentIndex = index;
        }

        showImage(currentIndex);

        jQuery('.pp_lightbox_trigger').click(function () {
            var clickedIndex = jQuery(this).attr('data-index');
            showImage(clickedIndex);
            jQuery('#pp_lightbox').fadeIn();
        });

        function closeLightbox() {
            jQuery('#pp_lightbox').fadeOut();
        }

        jQuery('#pp_lightbox, #pp_lightbox_close_btn').click(function (e) {
            if (e.target.id === 'pp_lightbox' || e.target.id === 'pp_lightbox_close_btn') {
                closeLightbox();
            }
        });

        jQuery('#pp_lightbox_prev_btn').click(function (e) {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });

        jQuery('#pp_lightbox_next_btn').click(function (e) {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });

        jQuery('#pp_lightboxImg').click(function (e) {
            e.stopPropagation();
        });
    }
});

function setSortIndicator(attributeIN){
    switch (attributeIN){
        case "data-name":
            theArrow = "#sortNameBTN > span";
            newSortOrder = 0; // a-z
            break;
        case "data-age":
        case "data-agegroupindex":
            theArrow = "#sortAgeBTN > span";
            newSortOrder = 0; // youngest to oldest
            break;
        case "data-weight":
        case "data-sizeindex":
            theArrow = "#sortSizeBTN > span";
            newSortOrder = 0; // smallest to largest
            break;
        case "data-daysin":
            theArrow = "#sortDaysInBTN > span";
            newSortOrder = 0; // long term to short term
            break;
    }

    sameButtonSelected = (jQuery(theArrow).hasClass("dashicons-arrow-up-alt") || jQuery(theArrow).hasClass("dashicons-arrow-down-alt"));

   // sortUp = jQuery(theArrow).hasClass("dashicons-arrow-up-alt");
   // sortDown = jQuery(theArrow).hasClass("dashicons-arrow-down-alt");

    jQuery(".pp_sort_btn > span").removeClass("dashicons-arrow-up-alt");
    jQuery(".pp_sort_btn > span").removeClass("dashicons-arrow-down-alt");

    if (!sameButtonSelected) { pp_globals.sortOrder = newSortOrder;}
    if (pp_globals.sortOrder == 0)
    {
        jQuery(theArrow).addClass("dashicons-arrow-down-alt");
    } else {
        jQuery(theArrow).addClass("dashicons-arrow-up-alt");
    }
}

function sortTiles(attributeIN){
    setSortIndicator(attributeIN);
    // Select all elements with class 'pp_tile'
    const tiles = document.querySelectorAll('.pp_tile');

    // Convert NodeList to Array for easier manipulation
    const tilesArray = Array.from(tiles);

    // Sort the array
    tilesArray.sort((a, b) => {

        let attributeValueA = a.getAttribute(attributeIN);
        let attributeValueB = b.getAttribute(attributeIN);

        // Convert the attribute values to numbers if possible, otherwise keep them as strings
        let ageA = isNaN(Number(attributeValueA)) ? attributeValueA.toLowerCase() : Number(attributeValueA);
        let ageB = isNaN(Number(attributeValueB)) ? attributeValueB.toLowerCase() : Number(attributeValueB);
    
        // Compare numbers and strings appropriately
        if (typeof ageA === 'number' && typeof ageB === 'number') {
            return ageA - ageB; // Numeric comparison
        } else {
            return ageA.localeCompare(ageB); // String comparison
        }
    });
    

    const container = tiles[0].parentNode;

    // Append sorted elements back to the container
    tilesArray.forEach(tile => {
        if (pp_globals.sortOrder == 0){
            container.appendChild(tile);
        }
        else{
            container.prepend(tile);
        }
    });
    if (pp_globals.sortOrder == 0){
        pp_globals.sortOrder = 1;
    }
    else{
        pp_globals.sortOrder = 0;
    }

//    jQuery(tilesArray).each(function(index) {
        jQuery(container.children).each(function(index) {
        if (index < pp_globals.intialNumTiles) {
            jQuery(this).removeClass('pp_hidden_tile').addClass('pp_shown_tile');
        } else {
            jQuery(this).removeClass('pp_shown_tile').addClass('pp_hidden_tile');
        }
    });

    // Check if there are any hidden tiles left
    if (jQuery('.pp_hidden_tile').length === 0) {
        jQuery('#show_more_tiles').hide();
    } else {
        jQuery('#show_more_tiles').show();
    }


   
}


function show_more_tiles() {
    // Find the first 20 elements with the class "pp_hidden_tile"
    var tilesToShow = jQuery('.pp_hidden_tile:lt('+pp_globals.intialNumTiles+')');
    // Remove the "pp_hidden_tile" class and add the "pp_shown_tile" class
    tilesToShow.removeClass('pp_hidden_tile').addClass('pp_shown_tile');
    
    var tilesStillHidden = jQuery('.pp_hidden_tile');
    if (tilesStillHidden.length == 0){
        jQuery('#pp_numshowntiles').hide();
        jQuery('#show_more_tiles').hide();
    }
    var count = jQuery('.pp_shown_tile').length;
    jQuery('#pp_numshowntiles').html("Showing " + count + " of ");
    

}

// Event binding
jQuery('#show_more_tiles').on('click', show_more_tiles);