
/**
 * login
 */
var app = new Vue({
    
    el: "#register",
    
    data: {
        registerUrl: "/KindlePocket/bindingData",
        newUserInfo: {
            userName:'n',
            phone:'13',
            email:'12',
            emailPwd:'22',
            kindleEmail:'asd'
        }
    },
    
    methods: {
        register: function() {
            
                axios.post(this.registerUrl, this.newUserInfo, {
                      headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                      }
                  })
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            
        }
    }
})