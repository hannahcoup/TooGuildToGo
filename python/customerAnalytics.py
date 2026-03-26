# Implement an environmental and financial impact tracker, which displays the student’s CO2 and money saved on student profile page.

import pandas as pd
import numpy as np 
import matplotlib.pyplot as plt
import io
import base64
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# mock analytics data 

def generateStudentAnalytics():
   dates = ["2026-02-02", "2026-02-09", "2026-02-16", "2026-02-23", "2026-03-02","2026-03-09",]
   
   co2Values = [2.1, 2.7, 3.2, 4.0, 1.9, 2.5]
   
   moneySaved = [12, 18, 15, 6, 17, 21]
   
   df = pd.DataFrame({
      "weeklyCo2": co2Values,
      "weeklyMoney": moneySaved,
   }, index=dates)

   df["co2Saved"] = df["weeklyCo2"].cumsum() # cumulative sum of their co2 savings
   df["moneySaved"] = df["weeklyMoney"].cumsum() # cumulative sum of their financial savings

   return df

# code from comp226

@app.get("/graph/co2")
def co2Graph():
   df = generateStudentAnalytics()

   fig, ax = plt.subplots(figsize=(8,4))
   ax.plot(df.index, df["co2Saved"], color="green")
   ax.set_title("Cumulative CO2 Saved (Kg)")
   ax.set_xlabel("Date")
   ax.set_ylabel("CO2")

   # Had to rely on medium https://medium.com/data-science/3-ways-to-embed-a-matplotlib-chart-into-an-html-page-8e11fa66a4b0 
   tempFile = io.BytesIO()
   fig.savefig(tempFile, format='png')
   plt.close(fig) 
   
   encoded = base64.b64encode(tempFile.getvalue()).decode('utf-8')

   htmlString = f'<html><body><img src="data:image/png;base64,{encoded}" style="width:100%;"></body></html>'

   return HTMLResponse(content=htmlString)
   

@app.get("/graph/money")
def moneyGraph():
   df = generateStudentAnalytics()

   fig, ax = plt.subplots(figsize=(8,4))
   ax.plot(df.index, df["moneySaved"], color="yellow")
   ax.set_title("Cumulative Money Saved (£)")
   ax.set_xlabel("Date")
   ax.set_ylabel("£")

   # Had to rely on medium https://medium.com/data-science/3-ways-to-embed-a-matplotlib-chart-into-an-html-page-8e11fa66a4b0 
   tempFile = io.BytesIO()
   fig.savefig(tempFile, format='png')
   plt.close(fig) 
   
   encoded = base64.b64encode(tempFile.getvalue()).decode('utf-8')

   htmlString = f'<html><body><img src="data:image/png;base64,{encoded}" style="width:100%;"></body></html>'

   return HTMLResponse(content=htmlString)
   
@app.get("/summary")
def getSummary():
   df = generateStudentAnalytics()

   summary = {
      "totalCo2": round(float(df["co2Saved"].iloc[-1]),2), # [-1] returns the last row in the dataframe, so the total cumulative co2 saved
      "totalMoney": round(float(df["moneySaved"].iloc[-1]), 2),  # the 2 is used for rounding to 2 decimal places
      "weeklyAverageCo2": round(float(df["weeklyCo2"].mean()), 2),
      "weeklyAverageMoney": round(float(df["weeklyMoney"].mean()), 2),
   }

   return summary

