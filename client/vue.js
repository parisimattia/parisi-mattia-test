var users =[];

var user = {
  name:"",
  surname:"",
  email:"",
  id:0,
  password:""
};

var token = localStorage.getItem('token');
console.log(this.user);
console.log(this.user.name);

const Signup = {
  template : `
  <form>
      <div class="row">
        <div class="col">
          <input type="text" class="form-control" placeholder="First name"  v-model= "this.name">
        </div>
        <div class="col">
          <input type="text" class="form-control" placeholder="Last name" v-model= "this.surname">
        </div>
      </div>
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" v-model= "this.email">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model= "this.password">
      </div>
      <button @click="signup()" type="submit" class="btn btn-primary">Signup</button>
    </form>
    `,
    methods: {
      signup: function() {
        this.$http.post(`http://localhost:8000/accounts/signup`, this.user)
        .then(function(response){
          this.users.push(this.user);
          this.user.name = "";
          this.user.surname = "";
          this.user.email = "";
          this.user.password = "" ;
          localStorage.setItem('password', user.password);
        })
      },
    }

  };
const Login = {
  template : `
  <form>
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
    </div>
    <div class="form-check">
      <input type="checkbox" class="form-check-input" id="exampleCheck1">
      <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <button @click="this.login()" type="submit" class="btn btn-primary">Submit</button>
  </form>
  `,
  methods: {
    login: function() {
      this.$http.post(`http://localhost:8000/accounts/login`)
      .then(function(response){
        this.token = response.body.token;
        localStorage.setItem('token', this.token);
      })
    },
  }
};

const Me = [{
  template: `
      <table style="width:100%">
        <tr>
          <th>Firstname</th>
          <th>Lastname</th>
          <th>Email</th>
          <th>id</th>
        </tr>
        <tr>
          <td>{{user.name}}</td>
          <td>{{user.surname}}</td>
          <td>{{user.email}}</td>
          <td>{{user.id}}</td>
        </tr>
      </table>
  `,
    methods: {
      me: function() {
        this.$http.get(`http://localhost:8000/accounts/me?token=${this.token}`)
        .then(function(response) {
          this.user = response.body;
        })
      }
    }
  }
];

var routes = [
  { path: '/signup', component: Signup},
  { path: '/login', component: Login},
  { path: '/me', component: Me}

]
var router = new VueRouter({
  routes
})
var v = new Vue ({
  router:router
}).$mount('#app')
