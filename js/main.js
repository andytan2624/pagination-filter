$(document).ready(function(){
    // Calculate how many students we have
    var number_students = $('.student-list li').length;
    /**
     * The max number of pages we ever need, even if the search box is used, this
     * will be the max number of pages needed
     */
    var initial_pages = number_students > 0 ? Math.ceil(number_students/10) : 1;


    /**
     * Add relevant HTML and hide necessary containers as needed
     */
    $('#no-students-div').hide();
    addSearch();
    $('<div class="pagination"><ul></ul></div>').insertAfter('.student-list');

    /**
     * Set up the page initially and show the first 10 students
     */
    addPagination(initial_pages);
    addPageNumberToStudents(initial_pages);
    showPageItems(1);

    /**
     * When clicking on any paginated tab, it'll show the students belong to that page
     * Works for dynamic elements
     */
    $('body').on('click', '.pagination ul li a', function(e) {
        e.preventDefault();
        var selected_page_number = $(this).closest('.pagination ul li').index() + 1;
        showPageItems(selected_page_number);
    });

    /**
     * When any key is tabbed into the search box, or pressing enter on the search button
     * It'll parse through the students and only show those that need to be shown
     */
    $('#q').keyup(function(){
        var typed_value = $(this).val().toLowerCase();
        query_students($(this).val().toLowerCase(), initial_pages);
    });
    $('.student-search button').on('click', function() {
        query_students($('#q').val().toLowerCase(), initial_pages);
    });

});

/**
 * Add the search bar to the page
 */
function addSearch() {
    $('.page-header').append('<div class="student-search"><input id="q" placeholder="Search for students..."><button>Search</button></div>');
}

/**
 * Hide all the students initially
 * Also mark for each student which page they'd initially be on
 */
function addPageNumberToStudents(max_pages) {
    var page_number = 1;
    var counter = 0;

    // Remove every class that starts with 'page-' or 'hide'
    for ( var i = 1; i <= max_pages; i++) {
        $('.student-item').removeClass('page-'+i);
    }

    $('.student-item').each(function(index, element){
        if (!$(element).hasClass('invalid')) {
            if (counter > 0 && counter % 10 == 0 ) {
                page_number++;
            }
            $(element).addClass('page-'+page_number);
            counter++;
        }
    });
}

/**
 * Create the pagination tabs based on how many pages is needed
 */
function addPagination(page_number) {
    $('.pagination ul').empty();
    for (var i = 1; i <= page_number; i++) {
        $('.pagination ul').append('<li><a href="#">' + i + '</a></li>');
    }
}

/**
 * Function that will show the students on a particular page, and hide the rest
 * @param page_number
 */
function showPageItems(page_number) {
    $('.student-item').hide();
    $('.pagination ul li a').removeClass('active');
    $('.page-' + page_number).fadeIn('slow');
    $('.pagination ul li:nth-child(' + page_number + ') > a').addClass('active');
}

/**
 * Function that will go through each student and check if their name or email match the search criteria
 * before going ahead and paginating the results.
 *
 * If it's a blank string, just paginate all the students
 *
 * If there are no students that match the search term, then show the no students error messages
 * @param typed_value
 * @param initial_pages
 */
function query_students(typed_value, initial_pages) {
    $('#no-students-div').hide('hide');
    var number_pages = 0;
    if (typed_value != '') {
        // Remove class
        $('.student-item').removeClass('invalid');
        // Go through each student list item, if name or email has part of the string, keep it, otherwise
        $('.student-item').each(function(index, element){
            if (
                $(element).find('h3').text().toLowerCase().indexOf(typed_value) < 0 &&
                $(element).find('.email').text().toLowerCase().indexOf(typed_value) < 0
            ) {
                $(element).addClass('invalid').hide();
            } else {
                number_pages++;
            }
        });

        number_pages = Math.ceil(number_pages/10);
    } else {
        number_pages = initial_pages;
    }

    if (number_pages == 0) {
        $('#no-students-div').show();
    }

    addPagination(number_pages);
    addPageNumberToStudents(initial_pages);
    showPageItems(1);
}