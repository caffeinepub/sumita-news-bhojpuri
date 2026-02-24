import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Mixins for authorization and blob storage
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Article category type and module
  type Category = {
    #cinema;
    #viralNews;
    #politics;
    #interview;
  };

  module Category {
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
  public type AuthorInfo = {
    name : Text;
    email : Text;
  };

  public type NewsArticle = {
    id : Text;
    title : Text;
    content : Text;
    excerpt : Text;
    imageId : ?Storage.ExternalBlob;
    category : Category;
    publishDate : Time.Time;
    author : AuthorInfo;
  };

  module NewsArticle {
    public func compareByDate(article1 : NewsArticle, article2 : NewsArticle) : Order.Order {
      Int.compare(article2.publishDate, article1.publishDate);
    };
  };

  // Map to store articles
  let articlesMap = Map.empty<Text, NewsArticle>();

  // Core functionality

  public shared ({ caller }) func createArticle(
    id : Text,
    title : Text,
    content : Text,
    excerpt : Text,
    imageId : ?Storage.ExternalBlob,
    category : Category,
    author : AuthorInfo,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create articles");
    };

    let newArticle : NewsArticle = {
      id;
      title;
      content;
      excerpt;
      imageId;
      category;
      publishDate = Time.now();
      author;
    };

    articlesMap.add(id, newArticle);
  };

  public shared ({ caller }) func updateArticle(
    id : Text,
    title : Text,
    content : Text,
    excerpt : Text,
    imageId : ?Storage.ExternalBlob,
    category : Category,
    author : AuthorInfo,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update articles");
    };

    let updatedArticle : NewsArticle = {
      id;
      title;
      content;
      excerpt;
      imageId;
      category;
      publishDate = Time.now();
      author;
    };

    articlesMap.add(id, updatedArticle);
  };

  public shared ({ caller }) func deleteArticle(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete articles");
    };

    switch (articlesMap.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?_) {
        articlesMap.remove(id);
      };
    };
  };

  public query ({ caller }) func getAllArticles(page : Nat, pageSize : Nat) : async [NewsArticle] {
    let sortedArticles = articlesMap.values().toArray();
    let sortedByDate = sortedArticles.sort(NewsArticle.compareByDate);

    let startIndex = page * pageSize;
    if (startIndex >= sortedByDate.size()) { return [] };

    let endIndex = Int.min(startIndex + pageSize, sortedByDate.size());

    let list = List.empty<NewsArticle>();
    var i = startIndex;
    while (i < endIndex) {
      list.add(sortedByDate[i]);
      i += 1;
    };

    list.toArray();
  };

  public query ({ caller }) func getArticleById(id : Text) : async NewsArticle {
    switch (articlesMap.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?article) { article };
    };
  };

  public query ({ caller }) func getArticlesByCategory(category : Category) : async [NewsArticle] {
    articlesMap.values().toArray().filter(
      func(article) { article.category == category }
    );
  };

  public query ({ caller }) func getCategories() : async [Text] {
    [
      Category.toText(#cinema),
      Category.toText(#viralNews),
      Category.toText(#politics),
      Category.toText(#interview),
    ];
  };

  public query ({ caller }) func getCategoriesInHindi() : async [(Text, Text)] {
    [
      ("cinema", "भोजपुरी सिनेमा"),
      ("viralNews", "वायरल खबर"),
      ("politics", "राजनीति"),
      ("interview", "इंटरव्यू"),
    ];
  };
};
