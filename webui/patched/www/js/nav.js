    $(document).ready(function () {

        $('.collapse').on('shown.bs.collapse', function () {
            $(this).parent().find(".fa-chevron-right").removeClass("fa-chevron-right").addClass(
                "fa-chevron-down");
        }).on('hidden.bs.collapse', function () {
            $(this).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass(
                "fa-chevron-right");
        });

        $('.nav_bar').click(function () {
            $('.navigation').toggleClass('visible');
        });

        $('#menu').metisMenu();

        $('.ico-search').click(function () {
            $('.expand-nav-content-userinfo').removeClass("showing");
            $(this)
                .siblings(".expand-nav-content-search")
                .toggleClass('showing');
        });
        $('.ico-user').click(function () {
            $('.expand-nav-content-search').removeClass("showing");
            $(this)
                .siblings(".expand-nav-content-userinfo")
                .toggleClass('showing');
        });

    });