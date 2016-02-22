/*var Alert = require('react-bootstrap').Alert;*/
var PettersComponent = React.createClass({
    loadCommentsFromServer: function() {

    },
  doSomething: function(){
      $.ajax({
          url: "http://localhost:3000/api/getdoctors",
          dataType: 'json',
          cache: false,
          success: function(data) {
              alert("success");
              console.log(data);
          }.bind(this),
          error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
          }.bind(this)
      });
  },
  render: function() {
    var name = 'Petter';
    return(
      <div>
        <h3>{this.props.user}</h3>
        <p>{this.props.children}</p>
        <a onClick={this.doSomething} href="#">Klikk på meg</a>
      </div>
    );
  }
});

ReactDOM.render(
  <div>
    <PettersComponent user="Petter">This guy is awesome</PettersComponent>
    <PettersComponent user="Amanda">She smells like flowers and is my best friend</PettersComponent>
  </div>,
  document.getElementById('content')
);
