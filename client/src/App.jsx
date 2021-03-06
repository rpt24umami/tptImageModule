import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Title from './components/Title.jsx';
import MainImage from './components/MainImage.jsx';
import Info from './components/Info.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '15',
      mainImage:'',
      imagesList: [],
      title: 'Title Placeholder',
      average: 0,
      ratings: 0,
      pages: 0,
      standards:['RL 4.4', 'RL 4.5'],
      grades: '4th Grade, 5th Grade'
    }
    this.onHover = this.onHover.bind(this);
  }

  onHover(url) {
    this.setState({
      mainImage: url
    });
  }

  componentDidMount() {
    let id = window.location.href.split("/")[4];
    this.setState({
      id: id
    });
    $.get(`http://localhost:3003/${id}/images`, (data) => {
        this.setState({
          mainImage: data[id][0],
          imagesList: data[id]
        });
    });
    $.get(`http://18.144.61.129:3001/products/${id}/ratings`, (data) => {
      let gradeList = [];
      data[2].forEach(grade => {
        gradeList.push(grade._id)
      });
      gradeList=gradeList.join(', ');
      this.setState({
        average: data[1][0].average,
        ratings: data[1][0].count,
        title: data[0],
        grades: gradeList
      });
    });
    $.get(`http://18.222.237.222:3002/products/${id}/description-and-standards`, (data) => {
      let standards = [];
      for (var key in data.standards) {
        standards.push(key)
      }
      this.setState({
        pages: data.pageLength,
        standards: standards
      });
    });
  }

  render() {
    return (
      <div id="images-app">
        <Title title={this.state.title} average={this.state.average} ratings={this.state.ratings}/>
        <MainImage image={this.state.mainImage} list={this.state.imagesList} hover={this.onHover}/>
        <Info pages={this.state.pages} standards={this.state.standards} grades={this.state.grades}/>
      </div>
    );
  }
}

export default App;
