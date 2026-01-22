<?php
function includeMenu($currentPage) {
    $menu = file_get_contents(__DIR__ . '/menu.html');
    
    // Add active class to current page
    $menu = str_replace('href="' . $currentPage . '"', 'href="' . $currentPage . '" class="active"', $menu);
    
    echo $menu;
}
?> 