import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Mixins for authorization and blob storage
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User profile type
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Article category type
  type Category = {
    #cinema;
    #viralNews;
    #politics;
    #interview;
  };

  module Category {
    public func compare(a : Category, b : Category) : Order.Order {
      switch (a, b) {
        case (#cinema, #cinema) { #equal };
        case (#cinema, _) { #less };
        case (#viralNews, #cinema) { #greater };
        case (#viralNews, #viralNews) { #equal };
        case (#viralNews, _) { #less };
        case (#politics, #interview) { #less };
        case (#politics, #politics) { #equal };
        case (#politics, _) { #greater };
        case (#interview, #interview) { #equal };
        case (_, _) { #greater };
      };
    };

    public func toText(category : Category) : Text {
      switch (category) {
        case (#cinema) { "भोजपुरी सिनेमा" };
        case (#viralNews) { "वायरल खबर" };
        case (#politics) { "राजनीति" };
        case (#interview) { "इंटरव्यू" };
      };
    };

    public func fromText(text : Text) : ?Category {
      switch (text) {
        case ("भोजपुरी सिनेमा") { ?#cinema };
        case ("वायरल खबर") { ?#viralNews };
        case ("राजनीति") { ?#politics };
        case ("इंटरव्यू") { ?#interview };
        case (_) { null };
      };
    };
  };

  // Article and author types
  type AuthorInfo = {
    name : Text;
    email : Text;
  };

  type NewsArticle = {
    id : Text;
    title : Text;
    content : Text;
    excerpt : Text;
    image : ?Storage.ExternalBlob;
    category : Category;
    publishDate : Time.Time;
    author : AuthorInfo;
  };

  // Internal article with validated image
  type InternalArticle = {
    id : Text;
    title : Text;
    content : Text;
    excerpt : Text;
    image : ?Storage.ExternalBlob;
    category : Category;
    publishDate : Time.Time;
    author : AuthorInfo;
  };

  module NewsArticle {
    public func compareByDate(article1 : NewsArticle, article2 : NewsArticle) : Order.Order {
      Int.compare(article2.publishDate, article1.publishDate);
    };
  };

  // State
  let articles = Map.empty<Text, InternalArticle>();

  func validateImage(image : ?Storage.ExternalBlob) : ?Storage.ExternalBlob {
    switch (image) {
      case (?blob) { ?blob };
      case (null) { null };
    };
  };

  // Core functionality - Admin only operations

  public shared ({ caller }) func createArticle(
    id : Text,
    title : Text,
    content : Text,
    excerpt : Text,
    image : ?Storage.ExternalBlob,
    category : Category,
    author : AuthorInfo,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create articles");
    };

    let newArticle : InternalArticle = {
      id;
      title;
      content;
      excerpt;
      image = validateImage(image);
      category;
      publishDate = Time.now();
      author;
    };

    articles.add(id, newArticle);
  };

  public shared ({ caller }) func updateArticle(
    id : Text,
    title : Text,
    content : Text,
    excerpt : Text,
    image : ?Storage.ExternalBlob,
    category : Category,
    author : AuthorInfo,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update articles");
    };

    let updatedArticle : InternalArticle = {
      id;
      title;
      content;
      excerpt;
      image = validateImage(image);
      category;
      publishDate = Time.now();
      author;
    };

    articles.add(id, updatedArticle);
  };

  public shared ({ caller }) func deleteArticle(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };

    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?_) { articles.remove(id) };
    };
  };

  // Read operations - accessible to all users including guests (no authorization checks)

  public query func getArticleById(id : Text) : async NewsArticle {
    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?internal) {
        {
          internal with
          image = internal.image;
        };
      };
    };
  };

  public query func getAllArticles(page : Nat, pageSize : Nat) : async [NewsArticle] {
    let sortedArticles = articles.values().toArray();
    let sortedByDate = sortedArticles.sort(
      func(a, b) { Int.compare(b.publishDate, a.publishDate) }
    );

    let startIndex = page * pageSize;
    if (startIndex >= sortedByDate.size()) { return [] };

    let endIndex = Int.min(startIndex + pageSize, sortedByDate.size());

    let list = List.empty<InternalArticle>();
    var i = startIndex;
    while (i < endIndex) {
      list.add(sortedByDate[i]);
      i += 1;
    };

    list.toArray().map(func(a) { { a with image = a.image } });
  };

  public query func getArticlesByCategory(category : Category) : async [NewsArticle] {
    let filtered = List.empty<InternalArticle>();
    let iter = articles.values();

    iter.forEach(
      func(article) {
        if (article.category == category) {
          filtered.add(article);
        };
      }
    );

    filtered.toArray().map(func(a) { { a with image = a.image } });
  };

  public query func getCategories() : async [Text] {
    Array.tabulate<Text>(
      4,
      func(i) {
        switch (i) {
          case (0) { Category.toText(#cinema) };
          case (1) { Category.toText(#viralNews) };
          case (2) { Category.toText(#politics) };
          case (3) { Category.toText(#interview) };
          case (_) { "" };
        };
      },
    );
  };

  public query func getCategoriesInHindi() : async [(Text, Text)] {
    [
      ("cinema", "भोजपुरी सिनेमा"),
      ("viralNews", "वायरल खबर"),
      ("politics", "राजनीति"),
      ("interview", "इंटरव्यू"),
    ];
  };
};
