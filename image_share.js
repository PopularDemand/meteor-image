// When declared out of if statements,
// information is available for client and server
Images = new Mongo.Collection("images");

if (Meteor.isClient){
  // Passing in an object with a property images
  // which contains image data array of objects
  // Template.images.helpers({images:img_data});

  Template.images.helpers({images:Images.find()})

  Template.images.events({
    'click .js-image': function(event){
      $(event.target).css("width", "50px");
    },
    'click .js-del-image': function(event){
      var image_id = this._id;
      $("#"+image_id).hide('slow', function(){
        Images.remove({"_id":image_id});
      })
    }
  });
}