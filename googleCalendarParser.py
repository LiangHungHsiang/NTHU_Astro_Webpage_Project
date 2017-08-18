# -*- coding: utf8 -*-
import urllib.request
import numpy as np
import datetime
import json

class DateClass():
	def __init__(self, timeZone, dateCode):
		self.timeZone = timeZone
		self.dateCode = dateCode
		self.year = int(dateCode[0:4])
		self.month = int(dateCode[4:6])
		self.day = int(dateCode[6:8])
		self.hour = int(dateCode[9:11])
		self.minute = int(dateCode[11:13])

		isLeapYear = 0
		if self.year % 400 == 0 or (self.year % 4 == 0 and self.year % 100 != 0):
			isLeapYear = 1
		else:
			isLeapYear = 0

		self.hour = self.hour + self.timeZone
		if self.hour >= 24:
			self.hour = self.hour - 24
			self.day = self.day + 1
			if self.day > 28 and self.month == 2 and isLeapYear == 0:
				self.day = self.day - 28
				self.month = self.month + 1
			if self.day > 29 and self.month == 2 and isLeapYear == 1:
				self.day = self.day - 29
				self.month = self.month + 1
			if self.day > 30 and (self.month == 4 or self.month == 6 or self.month == 9 or self.month == 11):
				self.day = self.day - 30
				self.month = self.month + 1
			if self.day > 31 and (self.month == 1 or self.month == 3 or self.month == 5 or self.month == 7 or self.month == 8 or self.month == 10):
				self.day = self.day - 31
				self.month = self.month + 1
			if self.day > 31 and self.month == 12:
				self.day = self.day -31
				self.month = self.month - 11
				self.year = self.year + 1
		if self.hour < 0:
			self.hour = self.hour + 24
			self.day = self.day - 1
			if self.day < 1:
				if self.month == 3 and isLeapYear == 0:
					self.day = self.day + 28
					self.month == self.month - 1
				if self.month == 3 and isLeapYear == 1:
					self.day = self.day + 29
					self.month == self.month - 1
				if self.month == 2 or self.month == 4 or self.month == 6 or self.month == 8 or self.month == 9 or self.month ==11:
					self.day = self.day + 31
					self.month = self.month - 1
				if self.month == 5 or self.month == 7 or self.month == 10 or self.month == 12:
					self.day = self.day + 30
					self.month = self.month - 1
				if self.month == 1:
					self.day = self.day + 31
					self.month = self.month + 11
					self.year = self.year - 1


def DateDictUpdate(date):
	dateDict = {}

	dateDict.update({ "Year": date.year})
	dateDict.update({ "Month": date.month})
	dateDict.update({ "Day": date.day})
	dateDict.update({ "Hour": date.hour})
	dateDict.update({ "Minute": date.minute})

	return dateDict


def JulianDayConverter(dateDict):
	YYYY = dateDict['Year']
	MM = dateDict['Month']

	if MM > 2:
		y = YYYY
		m = MM
	elif MM == 1 or MM == 2:
		y = YYYY - 1
		m = MM + 12

	DDdddd = dateDict['Day'] + dateDict['Hour']/24 + dateDict['Minute']/1440
	A = int(y/100)
	B = 2 - A + int(A/4)
	JD = int(365.25 * y) + int(30.6001 * (m + 1)) + DDdddd + 1720994.5 + B
	MJD = JD - 2400000.5

	return MJD


def SortEvent(eventList, timeZone, numOfTimeline):
	eventLength = len(eventList)
	sortedEventList = []
	MJD = np.zeros([eventLength, 2])

	nowTime = datetime.datetime.now() - datetime.timedelta(hours = timeZone)
	nowCode = nowTime.strftime("%Y%m%d"+"T" + "%H%M%S" + "Z")
	nowDate = DateClass(timeZone, nowCode)
	nowDateDict = DateDictUpdate(nowDate)
	nowMJD = JulianDayConverter(nowDateDict)

	for i in range(eventLength):
		MJD[i][0] = JulianDayConverter(eventList[i]['DTSTART']) - nowMJD
	rank = 1

	while rank <= numOfTimeline:
		localMin = 1000000
		position = 0
		found = 0
		for i in range(eventLength):
			if MJD[i][0] < localMin and MJD[i][0] > 0 and MJD[i][1] == 0:
				localMin = MJD[i][0]
				position = i
				found = 1
		if found == 1:
			MJD[position][1] = rank
			sortedEventList.append(eventList[position])
		rank = rank + 1

	return sortedEventList


def DataPreprocessing(text, timeZone):
	line = []
	event = []
	eventList = []
	isEvent = bool(0)

	textSplit = str(text).split('\r\n')

	for i in range(len(textSplit)):
		line.append(textSplit[i].split(':'))
		if line[i][0] == 'BEGIN' and line[i][1] == 'VEVENT' and isEvent == 0:
			event = {}
			isEvent = 1
			isSummary = 0
		if isEvent == 1:
			if line[i][0] == 'END' and line[i][1] == 'VEVENT':
				eventList.append(event)
				isEvent = 0
			elif line[i][0] == 'SUMMARY' and isSummary == 0:
				event.update({ line[i][0]: line[i][1]})
				isSummary = 1
			elif line[i][0] == 'DTSTART' or line[i][0] == 'DTEND':
				date = DateClass(timeZone, line[i][1])
				dateDict = DateDictUpdate(date)
				event.update({line[i][0]: dateDict})
			elif line[i][0] == 'DTSTART;VALUE=DATE':
				date = DateClass(0, line[i][1] + 'T000000Z')
				dateDict = DateDictUpdate(date)
				event.update({'DTSTART': dateDict})
			elif line[i][0] == 'DTEND;VALUE=DATE':
				date = DateClass(0, line[i][1] + 'T235959Z')
				date.day = date.day - 1
				dateDict = DateDictUpdate(date)
				event.update({'DTEND': dateDict})
			elif line[i][0][0:12] == 'DTSTART;TZID':
				date = DateClass(0, line[i][1])
				dateDict = DateDictUpdate(date)
				event.update({'DTSTART': dateDict})
			elif line[i][0][0:10] == 'DTEND;TZID':
				date = DateClass(0, line[i][1])
				dateDict = DateDictUpdate(date)
				event.update({'DTEND': dateDict})

	return eventList


def main():
	timeZone = 8
	numOfTimeline = 8
	googleCalendarURL = 'https://calendar.google.com/calendar/ical/sean49178840%40gmail.com/private-9e53b4c23c13e39f0fc9b8ec293a5b71/basic.ics'

	file = urllib.request.urlopen(googleCalendarURL)
	text = file.read().decode('UTF-8')
	eventList = DataPreprocessing(text, timeZone)
	sortedEventList = SortEvent(eventList, timeZone, numOfTimeline)
	
	with open('jsonEventList.json', 'w') as outfile:
	    json.dump(sortedEventList, outfile)


if __name__== "__main__":
    main()











