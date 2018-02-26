(function($) {

  alert('test');

  var body = document.body,
      html = document.documentElement,
      currentExternalURL,
      docHeight = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight ),
      currentURL = new Url; // get URL to modify query string for persistent tabs/modals

  // Browser fix for css: object-fit

  objectFitImages();

  // Check if element is a descendant of another element

  function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
      if (node == parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }


  // Check element and parents with href

  function findParentWithData(elem) {
    try {
      if(elem.href)
      return elem;
    } catch(e) {
      return e;
    }
    while(!elem.href) {
      return findParentWithData(elem.parentNode);
    }
  }


  // Finds closest ancestor with classname

  function findAncestor (el, cls) {
      while ((el = el.parentNode) && !el.classList.contains(cls));
      return el;
  }


  // Check if string is valid URL
  function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?'+ // port
    '(\\/[-a-z\\d%_.~+&:]*)*'+ // path
    '(\\?[;&a-z\\d%_.,~+&:=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
  }


  // Alert when clicking external link

  body.addEventListener('click', leavingSiteAlert);

  function externalURL(url) {
    if(isURL(url) && url !== location.host) {
      return true;
    }
  }

  function leavingSiteAlert(e) {
    var link = (e.target.tagName === 'A') ? e.target : e.target.parentNode;
    if(externalURL(link.host)) {
      e.preventDefault();
      currentExternalURL = link.href;
      openModal('modal-leaving-site');
    }
  }

  var externalLinkBtns = document.querySelectorAll('#modal-leaving-site .btn');
  if(externalLinkBtns.length > 0) {
    for(var i = 0; i < externalLinkBtns.length; i++) {
      externalLinkBtns[i].addEventListener('click', handleExternalLinkChoice);
    }
  }

  function handleExternalLinkChoice(e) {
    e.preventDefault();
    var link = findParentWithData(e.target);
    if(link.classList.contains('yes')) {
      window.location.href = currentExternalURL;
    }
    if(link.classList.contains('no')) {
      closeModalFunc(e);
    }
    e.stopPropagation();
  }


  // Add Degree

  var addDegree = document.querySelectorAll('.add-degree');
  if(addDegree.length > 0) {
    for(var i = 0; i < addDegree.length; i++) {
      addDegree[i].addEventListener('click', addDegreeHandler);
    }
  }

  function addDegreeHandler(e) {
    e.preventDefault();
    var field = findAncestor(e.target, 'field');
    var newField = document.createElement('input');
    newField.type = 'text';
    newField.placeholder = 'Degree Name';
    field.insertBefore(newField, e.target);
  }


  // Change Password Toggle

  var changePassword = document.querySelectorAll('.change-password');
  if(changePassword.length > 0) {
    for(var i = 0; i < changePassword.length; i++) {
      changePassword[i].addEventListener('click', changePasswordHandler);
    }
  }

  function changePasswordHandler(e) {
    e.preventDefault();
    var parent = findAncestor(e.target, 'field');
    var hidden = parent.nextElementSibling;
    hidden.classList.remove('hidden');
  }


  // Primary Search Toggle

  var primarySearchBtn = document.querySelector('#primary-nav li.search a');
  var primarySearchForm = document.querySelector('#primary-search input[type="text"]');
  if(primarySearchBtn){ primarySearchBtn.addEventListener('click', primarySearchToggle, false); }

  function primarySearchToggle(e, close) {
    e.preventDefault();

    if(close === undefined) {
      close = null;
    }

    //var use = (e.target.nodeName === 'use') ? e.target : e.target.querySelector('use');
    var use = document.querySelector('#primary-nav li.search use');
    var state = use.getAttribute('xlink:href');
    var newState = (state === '#search-icon') ? '#search-close-icon' : '#search-icon';
    use.setAttribute('xlink:href', newState);
    body.classList.toggle('primary-search-active');
    primarySearchForm.focus();
  }

  function closePrimarySearch() {
    var use = document.querySelector('#primary-nav li.search use');
    use.setAttribute('xlink:href', '#search-icon');
    body.classList.remove('primary-search-active');
  }

  // Masonry grid

  var msnry;
  var gridElem = document.querySelector('.masonry');

  if(gridElem !== null) {
    function masonryGrid() {
      var w = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );

      if(w >= 676 && !msnry) {
        msnry = new Masonry(gridElem, {
          itemSelector: '.modal-item',
          columnWidth: '.grid-sizer',
          percentPosition: true,
          resize: true
        });
        msnry.reloadItems();
      } else if(w < 676 && msnry) {
        msnry.destroy();
        msnry = null;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", masonryGrid);
  window.addEventListener("resize", masonryGrid);


  // Open Modal

  var activeModal = (currentURL.query.active_modal) ? currentURL.query.active_modal : null;

  if(activeModal) {
    openModal(activeModal);
  }

  function openModal(targetScreenId) {
    closePrimarySearch();

    // Add query param for persistent state
    activeModal = targetScreenId;
    currentURL.query.active_modal = activeModal;
    if(history.pushState) {
      window.history.pushState({active_modal: activeModal}, 'active-modal', currentURL.toString());
    }

    var modal = document.getElementById('primary-modal-container');
    var screens = document.querySelectorAll('.modal-screen');
    for(var i = 0; i < screens.length; i++) {
      screens[i].style.display = 'none';
    }
    document.getElementById(targetScreenId).style.display = 'block';
    modal.style.height = docHeight+'px';
    modal.querySelector('.inner').style.top = body.scrollTop+'px';
    body.classList.add('modal-active');
  }


  // Sign In Modal

  var closeModalLinks = document.querySelectorAll('.close-modal-link'),
      signInUp = document.querySelectorAll('.sign-in-up'),
      forgotPassword = document.querySelector('.modal-screen .forgot-password'),
      signInEmail = document.querySelector('.modal-screen .sign-in-email'),
      signUpEmail = document.querySelectorAll('.modal-screen .sign-up-email');

  if(signInUp){
    for(var i = 0; i < signInUp.length; i++) {
      signInUp[i].addEventListener('click', signInModalFunc);
    }
  }

  if(signInEmail) {
    signInEmail.addEventListener('click', signInEmailFunc);
  }

  if(signUpEmail) {
    for(var i = 0; i < signUpEmail.length; i++) {
      signUpEmail[i].addEventListener('click', signUpEmailFunc);
    }
  }

  if(forgotPassword){
    forgotPassword.addEventListener('click', forgotPasswordFunc);
  }

  if(closeModalLinks) {
    for(var i = 0; i < closeModalLinks.length; i++) {
      closeModalLinks[i].addEventListener('click', closeModalFunc);
    }
  }

  function closeModalFunc(e) {
    e.preventDefault();

    // clear modal query param
    currentURL.query.active_modal = null;
    if(history.pushState) {
      window.history.pushState({active_modal: null}, 'active-modal', currentURL.toString());
    }

    var screens = document.querySelectorAll('.modal-screen');
    var forgotPasswordForm = document.querySelector('.forgot-password-form');
    for(var i = 0; i < screens.length; i++) {
      screens[i].style.display = 'none';
    }
    body.classList.remove('modal-active');
    forgotPasswordForm.classList.add('hidden');
    e.stopPropagation();
  }

  function signInModalFunc(e) {
    e.preventDefault();
    body.classList.toggle('modal-active');
    openModal('sign-in-select');
  }

  function signInEmailFunc(e) {
    e.preventDefault();
    openModal('sign-in-email');
  }

  function signUpEmailFunc(e) {
    e.preventDefault();
    openModal('sign-up-email');
  }

  function forgotPasswordFunc(e) {
    e.preventDefault();
    var forgotPasswordForm = document.querySelector('.forgot-password-form');
    forgotPasswordForm.classList.remove('hidden');
  }


  // Add/Create Read List & Invite Peer to Conversation Modals

  var createRL = document.querySelectorAll('.create-rl');
  var addToRL = document.querySelectorAll('.add-to-rl');
  var invitePeer = document.querySelectorAll('.invite-peer-conversation');
  var invitePeerRL = document.querySelectorAll('.invite-peer-read-list');

  if(createRL.length > 0) {
    for(var i = 0; i < createRL.length; i++) {
      createRL[i].addEventListener('click', createRLModal);
    }
  }

  if(addToRL.length > 0) {
    for(var i = 0; i < addToRL.length; i++) {
      addToRL[i].addEventListener('click', addToRLModal);
    }
  }

  if(invitePeer.length > 0) {
    for(var i = 0; i < invitePeer.length; i++) {
      invitePeer[i].addEventListener('click', invitePeerModal);
    }
  }

  if(invitePeerRL.length > 0) {
    for(var i = 0; i < invitePeerRL.length; i++) {
      invitePeerRL[i].addEventListener('click', invitePeerRLModal);
    }
  }

  function createRLModal(e) {
    e.preventDefault();
    openModal('create-rl');
  }

  function addToRLModal(e) {
    e.preventDefault();
    openModal('add-to-rl');
  }

  function invitePeerModal(e) {
    e.preventDefault();
    openModal('invite-peer-conversation');
  }

  function invitePeerRLModal(e) {
    e.preventDefault();
    openModal('invite-peer-read-list');
  }


  // Content Changers

  var activeTab = (currentURL.query.active_tab) ? currentURL.query.active_tab : 0,
      contentChanger = document.querySelector('.content-changer');

  if(contentChanger) {
    var tabs = contentChanger.querySelectorAll('.tabs a');
    if(tabs) {
      for(var i = 0; i < tabs.length; i++) {
        if(i === parseInt(activeTab)) {
          tabs[i].parentNode.classList.add('active');
        }
        tabs[i].addEventListener('click', handleTabChange);
      }
    }

    contentChanger.querySelector('.changer-content[data-index="'+activeTab+'"]').classList.add('active');
  }

  function handleTabChange(e) {
    e.preventDefault();
    var index = e.target.dataset.index;
    var activeTab = contentChanger.querySelector('.tabs li.active');
    var active = contentChanger.querySelector('.changer-content.active');
    var content = contentChanger.querySelector('.changer-content[data-index="'+index+'"]');
    if(!_.contains(e.target.parentNode.classList, 'active')) {
      currentURL.query.active_tab = index;
      if(history.pushState) {
        window.history.pushState({active_tab: index}, 'active-tab', currentURL.toString());
      }
      e.target.parentNode.classList.add('active');
      activeTab.classList.remove('active');
      active.classList.remove('active');
      content.classList.add('active');
    }
  }


  // Primary nav dropdown

  var nav = document.getElementById('primary-nav');
  if(nav){ nav.addEventListener('click', showDropdown, false); }
  body.addEventListener('click', hideDropdown, false);

  function hideDropdown(e) {
    if(body.className.indexOf('primary-nav-dropdown-active') !== -1) {
      var dropdown = document.querySelector('.primary-nav-dropdown.active');
      if(!isDescendant(dropdown, e.target)) {
        body.classList.remove('primary-nav-dropdown-active');
        dropdown.classList.remove('active');
      }
    }
  }

  function showDropdown(e) {
    var target = e.target;
    var active = document.querySelector('.primary-nav-dropdown.active');
    if(_.contains(target.parentNode.classList, 'dropdown')) {
      e.preventDefault();
      if(findAncestor(target, 'dropdown')) {
        closePrimarySearch();
        if(active) {
          active.classList.remove('active');
        }
        var dropdown = findAncestor(target, 'dropdown').querySelector('.primary-nav-dropdown');
        body.classList.add('primary-nav-dropdown-active');
        dropdown.classList.add('active');
        e.stopPropagation();
      }
    }
  }


  // Image Slider

  $('.image-slider .slider').bxSlider({
    infiniteLoop: true,
    controls: false,
    pager: true
  });


  // Tour Slider
  var tourNext = document.querySelector('.btn.tour-next');
  var dismissTour = document.querySelector('.dismiss-tour');
  var tourHero = document.querySelector('.hero.take-tour');
  var tourCookie = getTourCookie();

  if(tourCookie === 'true') {
    if(tourHero) {
      tourHero.style.display = 'none';
    }
  }

  if(tourNext){ tourNext.addEventListener('click', handleTourNext); }
  if(dismissTour){ dismissTour.addEventListener('click', handleDismissTour); }

  function handleTourNext(e) {
    e.preventDefault();
    if(tourNext.classList.contains('finish')){
      window.location.replace('../screens/home-logged-in.php');
    } else {
      tourSlider.goToNextSlide();
    }
  }

  function getTourCookie() {
    return document.cookie.replace(/(?:(?:^|.*;\s*)displayTour\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  }

  function handleDismissTour(e) {
    if(tourHero) {
      tourHero.style.display = 'none';
    }
    document.cookie = 'displayTour=true'
  }

  var tourSlider = $('#tour-slider .slider').bxSlider({
    infiniteLoop: false,
    controls: false,
    pager: false,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    touchEnabled: false,
    speed: 1000,
    adaptiveHeight: true,
    onSlideBefore: function($slideElement, $oldIndex, $newIndex){
      if(($newIndex + 1) === tourSlider[0].children.length) {
        tourNext.innerText = 'Finish!';
        tourNext.classList.add('finish');
        handleDismissTour();
      };
      tourNext.removeEventListener('click', handleTourNext);
      tourSlider[0].children[$oldIndex].style.opacity = '0';
      setTimeout(function(){
        tourSlider[0].children[$newIndex].style.opacity = '1';
      }, 300);
    },
    onSlideAfter: function() {
      tourNext.addEventListener('click', handleTourNext);
    }
  });


  // Video embed proportional scaling

  $('body').fitVids();


  // Transient Notification

  function openTransientNotification(message) {
    var $this = $('#transient-notification');

    $this.text(message);
    $this.show();
    setTimeout(function(){
      $this.css({
        'opacity': 1,
        'transform': 'translate(-50%, 0)'
      });
      setTimeout(function(){
        $this.css({
          'opacity': 0,
          'transform': 'translate(-50%, 5rem)'
        });
        setTimeout(function(){
          $this.empty().show();
        }, 300);
      }, 2000);
    }, 50);
  }

  setTimeout(function(){
    openTransientNotification('This article has been added to your Read List');
  }, 2000);

  // Transient Create Read List
  class transientAddToRL {
    constructor(){
      this.transientAddToRL = $('#transientAddToRL');
      this.articleBody = $('.article-body');
      this.articleWidth;
      this.transientRightPos;
      this.closeBtn = this.transientAddToRL.find('.close');

      $(window).on('resize', function(){
        this.position();
      }.bind(this));

      $(window).on('scroll', function(){
        this.offset();
      }.bind(this));

      this.closeBtn[0].addEventListener('click', function(e){
        e.preventDefault();
        this.close();
      }.bind(this));

      setTimeout(function(){
        this.position();
        this.offset();
        this.display();
      }.bind(this), 5000); // 20000 for production
    }

    display(){
      if(this.articleBody.length){
        this.transientAddToRL.css('display','block');
        setTimeout(function(){
          this.transientAddToRL.css('opacity', 1);
        }.bind(this));
      }
    }

    close(){
      this.transientAddToRL.css({
        'opacity' : 0
      });
      setTimeout(function(){
        this.transientAddToRL.hide();
      }.bind(this), 500);
    }

    position(){
      if(window.matchMedia('(min-width: 768px)').matches){
        this.articleWidth = this.articleBody.width();
        this.transientRightPos = (($(window).width() - this.articleWidth) / 2) - this.transientAddToRL.outerWidth();

        if(this.transientRightPos > 20) {
          this.transientAddToRL.css('right', this.transientRightPos - 20+'px');
        } else {
          this.transientAddToRL.css('right', '20px');
        }
      }
    }

    offset(){
      if(window.matchMedia('(min-width: 768px)').matches){
        if(this.articleBody.offset().top < ($('#primary-header').outerHeight() + 20 + $(window).scrollTop())){
          this.transientAddToRL.css({
            'position' : 'fixed',
            'top' : $('#primary-header').outerHeight() + 20 + 'px'
          });
        } else {
          this.transientAddToRL.css({
            'position' : 'absolute',
            'top' : this.articleBody[0].getBoundingClientRect().top + $(window).scrollTop()+'px'
          });
        }
      }
    }
  }

  if($('.article-body').length){
    var transient = new transientAddToRL();
  }

})(jQuery);
