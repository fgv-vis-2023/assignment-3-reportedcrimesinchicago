[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/CxFZefIP)
# Data Visualization: Assignment 3 - Interactive Design

This is a project developed for the Data Visualization course, taught by professor Jorge Poco, by the students [Bernardo Vargas](https://github.com/bernardvma), [Cristiano Lárrea](https://github.com/cristianolarrea) and [Paloma Borges](https://github.com/palomavb), from the Data Science and Artificial Intelligence course at FGV.

We used the data from [Chicago Data Portal](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-Present/ijzp-q8t2), that reports inicidents of crime in Chicago extracted from teh Chicago PD, and the D3 library to build a visualization that shows the distribution of crime across Chicago.

## Design Decisions

With that Dataset, we have access to information about crimes in the city of Chicago, IL, from the years of 2001 all the way to 2023. The data is divided by type of crime, date, location, and other information, such as Community Area, which is the one we used to build our visualization. Since, we have many instances of crimes in this dataset (almost 7 million, nearly 2gb of data), we decided to filter from 2015 to 2023 as our timespan.

Altough we do not live in the United States and don´t have a deep knowledge about Chicago, we are aware that it is a huge city that is famous for its crime rate and violence, at least in these past years. With that in mind, we thought it would be intersting to try to respond to this question: How is the distribuition of crime in the city of Chicago? Does it have its focul points or is spread out thorughout its territory?

## Development Process

That question could be responded with a multiple number of visualizations, but to make it more complex and personal, we decided to use the D3 library to build a Choropleth Map, dividing the city in the Community Areas stablished in the dataset of choice. With that, we could show the distribution of crime in the city and people could easily identify areas of their interest (either to live, visit or stay for a while) and see the historical data of crime in that area, with stronger shades of red indicating areas with more crimes and progressively lightning the color in areas with less crimes.

The map visualization is interest by itself, but we decided to challenge ourselves to make it more informative and with a higher degree of dificulty, utilizing a wordcount with the "Description" column of the dataset. With that, we intend to show what appears most in the police description of the crimes in th region of choice from the user, utilizing his mouse to select the Community Area of interest.

In the terms of distribution of work, we habdled it by deciding what were the next steps that we needed to take and then deciding within the group which member would do each part. Although we didn't decide in the beginning of the assingment exactly what everyone would do, we did manage to organize ourselves in a way to deliver what our visualization intended in the first place. It is hard to tell exactly how much time we spent developing out visualization, but getting the tooltip to work and to update to each year and each community area where definetly the part that took most of our time in the process of getting our visualization ready (around 4 days to understand the d3 joins concepts and implementing in our visualization).

The map visualization is interest by itself, but we decided to challenge ourselves to make it more informative and with a higher degree of dificulty, utilizing a wordcount with the "Description" column of the dataset. With that, we intend to show what appears most in the police description of the crimes in th region of choice from the user, utilizing his mouse to select the Community Area of interest.

In the terms of distribution of work, we habdled it by deciding what were the next steps that we needed to take and then deciding within the group which member would do each part. Although we didn't decide in the beginning of the assingment exactly what everyone would do, we did manage to organize ourselves in a way to deliver what our visualization intended in the first place. It is hard to tell exactly how much time we spent developing out visualization, but getting the tooltip to work and to update to each year and each community area where definetly the part that took most of our time in the process of getting our visualization ready.

In the end, we think we reached our goal with our visualization, delivering the informations we wanted in a clear, interative and informative way.

## Sources and References
- [Chicago Data Portal](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-Present/ijzp-q8t2)
- [D3 Choropleth Map](https://observablehq.com/@chagel/d3-choropleth)
- [Word Cloud Function](https://observablehq.com/@d3/word-cloud)
