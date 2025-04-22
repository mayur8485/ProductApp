import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BarInterface } from './bar-chart.interface';
import * as d3 from 'd3';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-bar-chart',
  imports: [NgIf],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent implements OnChanges {
  @Input() id: number = 1;
  @Input() properties!: BarInterface;
  @Input() data: any = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.plotChart();
    }
  }

  ngAfterViewInit(): void {
    this.plotChart();
  }

  plotChart() {
    if (!this.data.length) return;
    this.createChart('barChart_' + this.id, this.properties, this.data);
  }

  createChart(containerId: string, property: BarInterface, data: any): void {
    // data = [...data];
    for (let i = 0; i < data.length; i++) {
      if (data[i][property.yAxis] > property.yScale) {
        property.yScale = data[i][property.yAxis];
      }
    }

    // console.log("Data received to draw a chart ", data);

    var container = d3.select('#' + containerId);
    // Remove existing SVG if any
    container.select('svg').remove();

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = property.width - margin.left - margin.right,
      height = property.height - margin.top - margin.bottom;

    // let vb = "0 0 " + property.width + " " + property.height;

    // append the svg object to the body of the page
    var svg = d3
      .select('#' + containerId)
      .append('svg')
      .attr('width', property.width + margin.left + margin.right + 100)
      .attr('height', property.height + margin.top + margin.bottom)
      // .attr("viewBox", vb)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d: any) => d[property.xAxis]))
      .padding(0.2);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    const y = d3.scaleLinear().domain([0, property.yScale]).range([height, 0]);
    svg.append('g').call(d3.axisLeft(y));
    // .attr("transform", "translate(0,0)rotate(0)");

    // Bars
    svg
      .selectAll('mybar')
      .data(data)
      .join('rect')
      .attr('class', 'label')
      .attr('x', (d: any): any => x(d[property.xAxis]))
      .attr('y', (d: any) => y(+d[property.yAxis]))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => height - y(+d[property.yAxis]))
      .attr('fill', '#69b3a2')
      .text((d: any) => +d[property.yAxis]);

    // add labels
    svg
      .selectAll('.text')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', function (d: any): any {
        return x(d[property.xAxis]);
      })
      .attr('y', function (d: any) {
        return y(+d[property.yAxis]) - 20;
      })
      .attr('dy', '.75em')
      .text(function (d: any) {
        return d[property.yAxis];
      });

    // X label
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 50)
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(0,70)rotate(0)')
      .style('font-family', 'Helvetica')
      .style('font-size', 20)
      .text(property.xAxis);

    // Y label
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(-40,' + height / 2 + ')rotate(-90)')
      .style('font-family', 'Helvetica')
      .style('font-size', 20)
      .text(property.yAxis);
  }
}
