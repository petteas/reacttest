
var PettersComponent = React.createClass({
  doSomething: function(){
    alert("Amanda, Jeg elsker deg <3. Vil du være med meg for alltid?");
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

React.render(
  <div>
    <PettersComponent user="Petter">This guy is awesome</PettersComponent>
    <PettersComponent user="Amanda">She smells like flowers and is my best friend</PettersComponent>
  </div>,
  document.getElementById('content')
);
