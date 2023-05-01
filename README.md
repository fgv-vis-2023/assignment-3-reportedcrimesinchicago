[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/CxFZefIP)
# Data Visualization: Assignment 3 - Interactive Design

This is a project developed for the Data Visualization course, taught by professor Jorge Poco, by the students [Bernardo Vargas](https://github.com/bernardvma), [Cristiano Lárrea](https://github.com/cristianolarrea) and [Paloma Borges](https://github.com/palomavb), from the Data Science and Artificial Intelligence course at FGV.

We used the data from the [Chicago Data Portal](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-Present/ijzp-q8t2), which reports incidents of crime in Chicago extracted from the Chicago PD, and the D3 library to build a visualization that shows the distribution of crime across Chicago.

## Design Decisions and Development Process

With that Dataset, we have access to information about crimes in the city of Chicago, IL, from the years 2001 to 2023. The data is divided by type of crime, date, location, and other information, such as Community Area, which is the one we used to build our visualization. Since, we have many instances of crimes in this dataset (almost 7 million, nearly 2 GB of data), we decided to filter from 2014 to 2022 as our timespan. We did not use the 2023 data, since it would not be a fair comparison of 4 months versus 12 months for the other years.

Although we do not live in the United States and do not have a deep knowledge about Chicago, we are aware that it is a huge city that is famous for its crime rate and violence, at least in these past years. With that in mind, we thought it would be interesting to try to respond to this question: How is the distribution of crime in the city of Chicago? Does it have its focal points or is spread out throughout its territory?

This question could be answered with multiple numbers of visualizations, but to make it more complex and personal, we decided to use the D3 library to build a Choropleth Map, dividing the city into the Community Areas established in the dataset of choice. With that, we could show the distribution of crime in the city and people could easily identify areas of their interest (either to live, visit or stay for a while) and see the historical data on crime in that area, with stronger shades of red indicating areas with more crimes and progressively lightening the color in areas with fewer crimes.

The map visualization is interesting by itself, but we decided to challenge ourselves to make it more informative by utilizing a word count with the "Description" column of the dataset. With that, we intend to show what appears most in the police description of the crimes in the region of choice from the user, utilizing his mouse to select the Community Area of interest.

At first, we started doing a word cloud to show the most common words in this "Description" column, but then we realized that maybe it was not the best way to do it. The word cloud can sometimes be confusing since it "splits" the words of each description, and these loose words, out of context, can cause misunderstanding. Therefore, we believe that word count would be more effective and efficient for our purpose.

In the terms of distribution of work, we handled it by deciding what were the next steps that we needed to take and then deciding within the group which member would do each part. Although we did not decide at the beginning of the assignment exactly what everyone would do, we did manage to organize ourselves in a way to deliver what our visualization intended in the first place. It is hard to tell exactly how much time we spent developing our visualization, but getting the tooltip to work and to update to each year and each community area was definitely the part that took most of our time in the process of getting our visualization ready (around 4 days to understand the D3 joins concepts and implementing it in our visualization).

In the end, we think we reached our goal with our visualization, delivering the information we wanted in a clear, interactive, and informative way.

## Sources and References
- [Chicago Data Portal](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-Present/ijzp-q8t2)
- [D3 Choropleth Map](https://observablehq.com/@chagel/d3-choropleth)