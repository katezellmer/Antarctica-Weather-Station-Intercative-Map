###########################################################################
# Notice on the use of Antarctic Meteorological Research Center data sets #
########################################################################### 
# The Antarctic Meteorological Research Center (AMRC) collects, archives  #
# and provides Antarctic meteorological observational data to the         #
# community and public for research, logistic, and educational activities.#
# The AMRC requests acknowledgement for use of the data in any published  #
# work. See http://amrc.ssec.wisc.edu/acknowledgement.html for details on #
# how to acknowledge AMRC data, displays or information.                  # 
# If the AMRC data are critical to the work, co-authorship may be         #
# appropriate.  Please contact the AMRC in such a case.                   #
#                                                                         #
# AMRC Contact Information:                                               #
# Address: 947 Atmospheric, Oceanic and Space Sciences Building           #
#          1225 West Dayton Street                                        #
#          Madison, Wisconsin, USA 53706                                  #
# Telephone: +1 (608) 265-4816                                            #
# Fax: +1 (608) 263-6738                                                  #
# E-mail: amrc@ssec.wisc.edu                                              #
# Web: http://amrc.ssec.wisc.edu/                                         #
# FTP: ftp://amrc.ssec.wisc.edu/                                          #
# McIDAS ADDE:  Group AMRC and ARCHIVE on aws.ssec.wisc.edu               #
# RAMADDA: https://amrc.ssec.wisc.edu/repository/                         #
# Facebook: http://www.facebook.com/AMRCAWS                               #
# Twitter: http://twitter.com/antmet                                      #
# Google+: https://plus.google.com/115034961929701598493/posts?hl=en      #
# YouTube: http://www.youtube.com/user/AMRCantmet                         #
# Wikipedia:                                                              #
# http://en.wikipedia.org/wiki/Antarctic_Meteorological_Research_Center   #
# http://en.wikipedia.org/wiki/Antarctic_Automatic_Weather_Stations_Project
#                                                                         #
# Updated: 16 July 2013                                                   #
#                                                                         #
###########################################################################

These files contain hourly data that has been quality controlled using
our interactive IDL programs. The files are labelled with a three letter
code to indicate the station, the year, the month, and the frequency of the
data (IIIYYYYMMq1h.txt for hourly data).

There is a two line header that gives the year, month, 3 letter ID, Argos ID,
and station name in the first line and latitude, longitude, and elevation in
the second line.

The columns are as follows:

1     Year
2     Julian day
3     Month
4     Day
5     One hour observation time
6     Temperature (C)
7     Pressure (hPa)
8     Wind Speed (m/s)
9     Wind Direction
10    Relative Humidity (%)
11    Delta-T (C)

