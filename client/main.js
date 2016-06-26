// Used to set up infinite scroll
Session.set("imageLimit", 8);
lastScrollTop = 0;
$(window).scroll(function(event){
  // Tests if we are near the bottom of the window.
  if ($(window).scrollTop() + $(window).height() > $(document).height()-100){
    // Where are we on the page
    var scrollTop = $(this).scrollTop();
    // Test if I am going down
    if (scrollTop > lastScrollTop){
      Session.set("imageLimit", Session.get("imageLimit") + 4);
    }

    lastScrollTop = scrollTop;
  }
});

// Function available through accounts packages
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

// Defines helpers for "images" template
Template.images.helpers({
  images: function(){
    if (Session.get("userFilter")){
      // createdBy is a user id
      // userFilter is a event function in the images template
      return Images.find({createdBy: Session.get("userFilter")},
                         {sort:{createdOn: -1, rating:-1}});
    }
    else {
      // find: {} -> all of them
      //       rating: -1  -> reverse (high to low)
      //       options object: sort/limit etc
      return Images.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("imageLimit")});
    }
  },
  filtering_images: function(){
    if (Session.get("userFilter")) return true;
    else return false;
  },
  getUser: function(user_id){
    // Meteor.users refers to the user collection.
    // Different because meteor is managing users
    var user = Meteor.users.findOne({_id: user_id});
    if (user) return user.username;
    else return "anon";
  },
  getFilterUser: function(){
    if (Session.get("userFilter")) {
      var filterUser = Meteor.users.findOne({_id:Session.get("userFilter")});
      return filterUser.username;
    }
  }
})

// Defines helpers for body tag
Template.body.helpers({
  username: function(){
    return Meteor.user() ? Meteor.user().username : "Anonymous";
}
})

// Defines event listeners for "images" template
Template.images.events({
  'click .js-image': function(event){
    $(event.target).css("width", "50px");
  },
  'click .js-del-image': function(event){
    var image_id = this._id;
    $("#"+image_id).hide('slow', function(){
      Images.remove({"_id":image_id});
    })
  },
  'click .js-rate-image': function(event){
    var rating = $(event.currentTarget).data("userrating");
    console.log(event.currentTarget);
    var image_id = this.id;
    console.log(image_id);

    Images.update({_id: image_id},
                  {$set: {rating:rating}});
  },
  'click .js-show-image-form': function(event) {
    $("#image_add_form").modal("show");
  },
  'click .js-set-image-filter': function(event) {
    // 'this' is the data context for the template
    // in which the event occured
    Session.set("userFilter", this.createdBy);
  },
  'click .js-unset-image-filter': function(event){
    Session.set("userFilter", undefined);
  }
});

// Event listeners for "image add form" template
Template.image_add_form.events({
  'submit .js-add-image': function(event){
    var img_src, img_alt;
    // Not using jquery because form allows easy access with name fields
    img_src = event.target.img_src.value;
    img_alt = event.target.img_alt.value;
    // console.log("src: " + img_src);
    // console.log("alt " + img_alt);
    if (Meteor.user()) {
      Images.insert({
        img_src: img_src,
        img_alt: img_alt,
        createdOn: new Date(),
        createdBy: Meteor.user()._id
      });
    }
    $("#image_add_form").modal("hide");
    return false;
  }
});
