import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { PieInterface } from './pie.chart-interface';
import { NgIf, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-pie',
  imports: [NgIf, TitleCasePipe],
  templateUrl: './pie.component.html',
  styleUrl: './pie.component.css',
})
export class PieComponent implements OnChanges {
  @Input() id: number = 2;
  @Input() properties!: PieInterface;
  @Input() data!: Record<string, any>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.plotChart();
    }
  }

  ngAfterViewInit(): void {
    this.plotChart();
  }

  plotChart() {
    if (!this.data) return;
    this.createChart('pieChart_' + this.id, this.properties, this.data);
  }

  createChart(chartId: any, property: PieInterface, data: any) {
    // data = { ...data };
    // console.log("Data received to draw a chart ", data);
    var container = d3.select('#' + chartId);
    // Remove existing SVG if any
    container.select('svg').remove();

    // set the dimensions and margins of the graph
    const margin = 10;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(property.width, property.height) / 2 - margin + 100;
    // append the svg object to the div called 'my_dataviz'
    const svg = d3
      .select('#' + chartId)
      .append('svg')
      .attr('width', property.width)
      .attr('height', property.height)
      .append('g')
      .attr(
        'transform',
        `translate(${property.width / 2}, ${property.height / 2})`
      );

    // Create dummy data
    // const data: any = { a: 9, b: 20, c: 30, d: 8, e: 12 }

    // set the color scale
    const color = d3.scaleOrdinal().range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    const pie: any = d3.pie().value(function (d: any) {
      return d[1];
    });
    const data_ready = pie(Object.entries(data));

    // shape helper to build arcs:
    const arcGenerator: any = d3
      .arc()
      .innerRadius(0)
      .outerRadius(property.radius);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('mySlices')
      .data(data_ready)
      .join('path')
      .attr('d', arcGenerator)
      .attr('fill', function (d: any): any {
        return color(d.data[0]);
      })
      .attr('stroke', 'black')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
      .selectAll('mySlices')
      .data(data_ready)
      .join('text')
      .text(function (d: any) {
        return d.data[0] + ' : ' + d.data[1];
      })
      .attr('transform', function (d) {
        return `translate(${arcGenerator.centroid(d)})`;
      })
      .style('text-anchor', 'middle')
      .style('font-size', property.fontsize);
  }
}
