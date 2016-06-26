// This information is available for client and server
Images = new Mongo.Collection("images");

// Set up security on images collection
Images.allow({
  // userId: Who is attempting this action, passed in automagially
  insert: function(userId, doc){
    if(Meteor.user()){ // If user is logged in
      if (userId === doc.createdBy) return true; // User must own the image
      else return false;
    }
    else return false; // User not logged in
  },
  remove: function(userId, doc){
    if(Meteor.user()){
      if (userId === doc.createdBy) return true; // User must own the image
      else return false;
    }
    else return false;
  }
})