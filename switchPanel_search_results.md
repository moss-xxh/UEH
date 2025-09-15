# switchPanel Function Search Results

Based on my analysis of `/Users/xuexinhai/Desktop/UEH/index.html`, here are the findings:

## switchPanel Function Calls Found:

1. **Line 3012-3013**: Tab button onclick handlers
   ```html
   <button class="panel-tab active" onclick="switchPanel('market', this)"><span data-i18n-key="market">行情</span></button>
   <button class="panel-tab" onclick="switchPanel('map', this)"><span data-i18n-key="map">地图</span></button>
   ```

2. **Line 5454**: Called from startOperation function
   ```javascript
   switchPanel('map');
   ```

3. **Line 6405**: Called from updatePowerStationStatus function
   ```javascript
   switchPanel('map');
   ```

4. **Line 6421**: Called from updatePowerStationStatus function
   ```javascript
   switchPanel('market');
   ```

5. **Line 9068**: Called from window.forceMarket function
   ```javascript
   switchPanel('market');
   ```

6. **Line 9137**: Called from window.testMapChart function
   ```javascript
   switchPanel('map');
   ```

7. **Line 9429**: Called from window.selectRegion function
   ```javascript
   switchPanel('map');
   ```

8. **Line 9433**: Called from window.selectRegion function
   ```javascript
   switchPanel('market');
   ```

## Problem Identified:
The `switchPanel` function is being called extensively throughout the code, but **THE FUNCTION DEFINITION IS MISSING** from the current index.html file.

## Current Issue:
The function is called with two parameters in the HTML (`switchPanel('market', this)`) but most JavaScript calls use only one parameter (`switchPanel('market')`). This suggests the function needs to handle both call patterns.

## Expected Behavior:
The switchPanel function should:
1. Switch between market and map panels
2. Update panel tab active states
3. Handle chart resizing when panels become visible
4. Maintain clean separation between market and map data

## Solution Needed:
The `switchPanel` function needs to be implemented to properly handle panel switching logic.