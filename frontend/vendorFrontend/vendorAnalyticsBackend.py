
import pandas as pd
import numpy as np 
import matplotlib
matplotlib.use('Agg')
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

def generateVendorAnalytics():
   products = ["Pastries", "Sandwiches & Paninis", "Cakes", "Wraps", "Yogurt Pots"]
   
   viewed = [28, 35, 22, 45, 18]
   engaged = [18, 22, 14, 28, 11]
   reserved = [6, 9, 5, 14, 4]

   df = pd.DataFrame({
      "viewed": viewed,
      "engaged": engaged,
      "reserved": reserved,
   }, index=products)

   return df

@app.get("/graph/vendorAnalytics")
def getVendorAnalytics():
   df = generateVendorAnalytics()

   barWidth = 0.5
   barPositions = np.arange(len(df)) 
   fig, ax = plt.subplots(figsize =(12, 8)) 

   viewed = df["viewed"]
   engaged = df["engaged"]
   reserved = df["reserved"]

   bar1 = ax.bar(barPositions, viewed, color ='navy', width = barWidth, label ='Viewed') 
   bar2 = ax.bar(barPositions, viewed, color ='steelblue', width = barWidth, label ='Engaged View', bottom=df["viewed"]) 
   bar3 = ax.bar(barPositions, viewed, color ='gold', width = barWidth, label ='Reserved', bottom=df["viewed"]+df["engaged"]) 
   
   ax.set_xticks(barPositions)
   ax.set_xticklabels(df.index, rotation=20, ha="right", fontsize=11)
   ax.yaxis.set_major_locator(plt.MultipleLocator(10))
   ax.legend(loc="upper left")

   plt.title("Product Analysis", fontweight ='bold', fontsize = 15, pad=14)
   plt.tight_layout()
   
   # Had to rely on medium https://medium.com/data-science/3-ways-to-embed-a-matplotlib-chart-into-an-html-page-8e11fa66a4b0 
   tempFile = io.BytesIO()
   fig.savefig(tempFile, format='png')
   plt.close(fig) 
   
   encoded = base64.b64encode(tempFile.getvalue()).decode('utf-8')

   htmlString = f'<html><body><img src="data:image/png;base64,{encoded}" style="width:100%; height:100%; object-fit: contain;"></body></html>'

   return HTMLResponse(content=htmlString)