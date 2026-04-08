import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Int "mo:core/Int";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  type Racket = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    weight : Float;
    balance : Text;
    power : Int;
    imageUrl : ?Text;
    category : Text;
    inStock : Bool;
  };

  type BlogPost = {
    id : Nat;
    title : Text;
    excerpt : Text;
    content : Text;
    category : Text;
    imageUrl : Text;
    publishedAt : Int;
    author : Text;
  };

  type MatchStatus = {
    #live;
    #completed;
  };

  type MatchStats = {
    player : Text;
    opponent : Text;
    score : Text;
    setScores : [Text];
    status : MatchStatus;
  };

  type DrillDifficulty = {
    #beginner;
    #intermediate;
    #advanced;
  };

  type TrainingDrill = {
    id : Nat;
    name : Text;
    description : Text;
    difficulty : DrillDifficulty;
    duration : Nat;
    category : Text;
  };

  type Tip = {
    id : Nat;
    question : Text;
    answer : Text;
  };

  let racketStore = Map.empty<Nat, Racket>();
  let blogPostStore = Map.empty<Nat, BlogPost>();
  let drillStore = Map.empty<Nat, TrainingDrill>();
  let tipStore = Map.empty<Nat, Tip>();
  let matchStatsStore = Map.empty<Nat, MatchStats>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
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

  // Racket Management
  public shared ({ caller }) func createRacket(racket : Racket) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create rackets");
    };
    if (racketStore.containsKey(racket.id)) {
      Runtime.trap("Racket with id " # racket.id.toText() # " already exists");
    };
    racketStore.add(racket.id, racket);
  };

  public shared ({ caller }) func updateRacket(racket : Racket) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update rackets");
    };
    if (not racketStore.containsKey(racket.id)) {
      Runtime.trap("Racket not found");
    };
    racketStore.add(racket.id, racket);
  };

  public shared ({ caller }) func deleteRacket(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete rackets");
    };
    racketStore.remove(id);
  };

  public query func getRacket(id : Nat) : async Racket {
    switch (racketStore.get(id)) {
      case (?racket) { racket };
      case (null) { Runtime.trap("Racket not found") };
    };
  };

  public query func getAllRackets() : async [Racket] {
    racketStore.values().toArray();
  };

  // Blog Posts
  public query func getBlogPost(id : Nat) : async BlogPost {
    switch (blogPostStore.get(id)) {
      case (?post) { post };
      case (null) { Runtime.trap("Blog post not found") };
    };
  };

  module BlogPost {
    public func compareByDate(post1 : BlogPost, post2 : BlogPost) : Order.Order {
      Int.compare(post2.publishedAt, post1.publishedAt);
    };
  };

  let sportsPostsArray = List.empty<BlogPost>();
  func enlargeSearchResultsArray(post : BlogPost) {
    sportsPostsArray.add(post);
  };

  public query func getAllBlogPosts() : async [BlogPost] {
    blogPostStore.values().toArray().sort(BlogPost.compareByDate);
  };

  public query func getBlogPostsByCategory(category : Text) : async [BlogPost] {
    sportsPostsArray.clear();
    blogPostStore.values().forEach(
      func(post) {
        if (Text.equal(post.category, category)) {
          enlargeSearchResultsArray(post);
        };
      }
    );
    sportsPostsArray.toArray();
  };

  // Drills
  public query func getAllDrills() : async [TrainingDrill] {
    drillStore.values().toArray();
  };

  public query func getDrill(id : Nat) : async TrainingDrill {
    switch (drillStore.get(id)) {
      case (?drill) { drill };
      case (null) { Runtime.trap("Drill not found") };
    };
  };

  public query func getDrillsByDifficulty(difficulty : DrillDifficulty) : async [TrainingDrill] {
    drillStore.values().toArray().filter(func(drill) { drill.difficulty == difficulty });
  };

  // Tips
  public query func getAllTips() : async [Tip] {
    tipStore.values().toArray();
  };

  public query func getTip(id : Nat) : async Tip {
    switch (tipStore.get(id)) {
      case (?tip) { tip };
      case (null) { Runtime.trap("Tip not found") };
    };
  };

  public query func getRandomTip() : async Tip {
    let tips = tipStore.values().toArray();
    if (tips.size() == 0) {
      Runtime.trap("No tips available");
    } else {
      tips[0];
    };
  };

  // Match Stats
  public query func getCurrentMatches() : async [MatchStats] {
    matchStatsStore.values().toArray().filter(
      func(match) { match.status == #live }
    );
  };

  public query func getCompletedMatches() : async [MatchStats] {
    matchStatsStore.values().toArray().filter(
      func(match) { match.status == #completed }
    );
  };

  public query func getAllMatches() : async [MatchStats] {
    matchStatsStore.values().toArray();
  };

  // Initialization/Seed Data
  public shared ({ caller }) func seedData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed data");
    };

    let now = Time.now();

    // Seed rackets
    let racket1 : Racket = {
      id = 1;
      name = "Head Graphene 360+ Speed Pro";
      description = " Professional-level performance racket for advanced players.";
      price = 249.99;
      weight = 310.0;
      balance = "Head Light";
      power = 85;
      imageUrl = ?"https://example.com/head.jpg";
      category = "Performance";
      inStock = true;
    };

    let racket2 : Racket = {
      id = 2;
      name = "Wilson Pro Staff RF97 Autograph";
      description = "Roger Federer's signature model, designed for serious players.";
      price = 279.00;
      weight = 340.0;
      balance = "Head Heavy";
      power = 90;
      imageUrl = ?"https://example.com/wilson.jpg";
      category = "Performance";
      inStock = true;
    };

    racketStore.add(1, racket1);
    racketStore.add(2, racket2);

    // Seed blog posts
    let post1 : BlogPost = {
      id = 1;
      title = "Mastering the One-Handed Backhand";
      excerpt = "Learn how to develop a world-class backhand with these tips.";
      content = "Full article content goes here...";
      category = "Technique";
      imageUrl = "https://example.com/backhand.jpg";
      publishedAt = now - 3_000_000_000;
      author = "Coach Joe";
    };

    let post2 : BlogPost = {
      id = 2;
      title = "Top 5 Tennis Shoes for 2024";
      excerpt = "We review the best tennis shoes for various playing styles.";
      content = "Full article content goes here...";
      category = "Gear";
      imageUrl = "https://example.com/shoes.jpg";
      publishedAt = now - 5_000_000_000;
      author = "Jane Smith";
    };

    blogPostStore.add(1, post1);
    blogPostStore.add(2, post2);

    // Seed drills
    let drill1 : TrainingDrill = {
      id = 1;
      name = "Target Practice";
      description = "Develop consistency with this simple drill";
      difficulty = #beginner;
      duration = 15;
      category = "Groundstrokes";
    };

    let drill2 : TrainingDrill = {
      id = 2;
      name = "Serve and Volley";
      description = "Improve your approach game";
      difficulty = #intermediate;
      duration = 20;
      category = "Serve/Volley";
    };

    drillStore.add(1, drill1);
    drillStore.add(2, drill2);

    // Seed tips
    let tip1 : Tip = {
      id = 1;
      question = "How can I increase my serve speed?";
      answer = "Focus on strengthening your core and shoulder muscles.";
    };

    let tip2 : Tip = {
      id = 2;
      question = "How do I handle high-bouncing balls?";
      answer = "Take early steps. Position to strike at highest comfortable point.";
    };

    tipStore.add(1, tip1);
    tipStore.add(2, tip2);

    // Seed match stats
    let match1 : MatchStats = {
      player = "Maxi Kremer";
      opponent = "Emily Novak";
      score = "2-1";
      setScores = ["3-6", "6-4", "7-5"];
      status = #completed;
    };

    let match2 : MatchStats = {
      player = "John Smith";
      opponent = "Roger Federer";
      score = "1-0";
      setScores = ["6-4"];
      status = #live;
    };

    matchStatsStore.add(1, match1);
    matchStatsStore.add(2, match2);
  };
};
