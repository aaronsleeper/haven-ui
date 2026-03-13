# Patients App - User Flows

## Overview

This document outlines complex user flows and use cases for the Cena Health patients application. Each flow demonstrates both the traditional UI path and the conversational Ava-assisted path where applicable.

---

## Flow 1: Place a Meal Order

### Traditional UI Path

**Starting Point:** User navigates to Meals > Place New Order

1. **Select Delivery Date**
   - User sees calendar with available delivery dates
   - Past dates are disabled
   - User clicks on desired delivery date (defaults to first available)

2. **Review Meal Preferences**
   - System displays patient's dietary restrictions and preferences
   - User can click preference tags to filter meal options
   - User can view all meals or apply filters

3. **Select Meals**
   - Browse available meal options with photos
   - Each meal shows nutritional info and ingredient list
   - User clicks "Add to Order" for desired meals
   - Running count shows total meals selected

4. **Review Order**
   - Summary displays: delivery date, meal count, items list
   - User can remove items or adjust quantities
   - User sees submission cutoff date/time

5. **Confirm Order**
   - User clicks "Confirm Order"
   - System validates order against care plan
   - Confirmation screen shows order details and expected delivery

6. **Post-Confirmation**
   - Order appears in Orders list with "Scheduled" status
   - User receives confirmation notification
   - Audit log entry created in Ava chat pane

### Conversational Ava Path

**Starting Point:** User opens Ava from any screen

1. **User:** "I need to order meals for next week"

2. **Ava Greeting:**
   ```
   #ava I'd be happy to help you order meals! Based on your preferences
   and recent orders, I have some recommendations. Would you like to:

   [Button: See my recommendations]
   [Button: I'll choose myself]

   Also, which delivery date works for you? Next available is Tuesday, Dec 12.
   ```

3. **User clicks:** "See my recommendations"

4. **Ava Response:**
   ```
   #ava Great! Based on your care plan (low sodium, gluten-free) and
   the meals you enjoyed last time, I recommend:

   - Mediterranean Grilled Chicken (you rated this 5 stars!)
   - Lemon Herb Salmon with Quinoa
   - Turkey Meatballs with Zucchini Noodles
   - Vegetable Stir-fry with Tofu

   That's 4 meals for delivery on Tuesday, Dec 12.

   [Button: Yes, order these for me]
   [Button: Let me swap some items]
   [Button: Show me all options]
   ```

5. **User clicks:** "Let me swap some items"

6. **Ava:** "Which meal would you like to replace?"

7. **User:** "Instead of the tofu one, do you have any chicken or fish options?"

8. **Ava:**
   ```
   #ava Sure! Here are gluten-free, low-sodium chicken and fish options:

   - Blackened Tilapia with Green Beans
   - Chicken Piccata with Cauliflower Rice
   - Cajun Grilled Shrimp with Vegetables

   Which would you prefer?
   ```

9. **User:** "The tilapia sounds good"

10. **Ava Confirmation:**
    ```
    #ava Perfect! Here's your order:

    Delivery: Tuesday, Dec 12
    Meals (4):
    • Mediterranean Grilled Chicken
    • Lemon Herb Salmon with Quinoa
    • Turkey Meatballs with Zucchini Noodles
    • Blackened Tilapia with Green Beans

    Order cutoff: Friday, Dec 8 at 5:00 PM

    Should I place this order for you?
    [Button: Yes, place order]
    [Button: Make changes]
    ```

11. **User clicks:** "Yes, place order"

12. **Ava Final Confirmation:**
    ```
    #ava ✓ Order placed successfully!

    Your 4 meals will be delivered on Tuesday, Dec 12.
    You can modify this order until Friday, Dec 8 at 5:00 PM.

    [Collapsed audit block: Order placed - 4 meals, Dec 12]
    ```

---

## Flow 2: Complete an Assessment (PHQ-9)

### Traditional UI Path

**Starting Point:** User navigates to My Health > Assessments

1. **Assessment List View**
   - User sees list of assessments sorted by date
   - PHQ-9 shows status: "Available" with due date
   - User clicks on PHQ-9 assessment

2. **Assessment Introduction**
   - Screen shows assessment name, purpose, estimated time
   - Brief description: "This assessment helps us understand your mood and mental well-being"
   - User clicks "Begin Assessment"

3. **Question Flow**
   - Questions presented one per screen (or grouped logically)
   - PHQ-9 Q1: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?"
   - Options: Not at all (0) | Several days (1) | More than half the days (2) | Nearly every day (3)
   - User selects answer, clicks "Next"
   - Progress indicator shows "Question 2 of 9"

4. **Continue Through Questions**
   - User proceeds through all 9 questions
   - Can use "Back" to review/change previous answers
   - Can save progress and exit (marked "In Progress")

5. **Review & Submit**
   - Summary page shows all answers
   - User can edit any response
   - User clicks "Submit Assessment"

6. **Results & Recommendations**
   - System calculates score
   - If score triggers alert (≥10): Ava generates message to care team + patient sees "Your care team has been notified" message
   - Patient sees score interpretation and recommended next steps
   - Assessment marked "Completed" with timestamp

### Conversational Ava Path

**Starting Point:** User interacts with Ava greeting on Assessments page

1. **Ava Greeting (on Assessments page):**
   ```
   #ava Hi! I see you have a PHQ-9 assessment due by Dec 15.
   This helps us understand how you've been feeling lately.

   Would you like to complete it now? I can walk you through it
   conversationally, or you can use the form.

   [Button: Complete with Ava]
   [Button: Use form instead]
   ```

2. **User clicks:** "Complete with Ava"

3. **Ava Begins Assessment:**
   ```
   #ava Great! I'll ask you 9 short questions about the past 2 weeks.
   Just answer naturally - I'll translate your responses into the
   assessment format and you can review before submitting.

   First question: Over the last 2 weeks, how often have you felt
   little interest or pleasure in doing things you normally enjoy?
   ```

4. **User:** "Maybe a couple days last week, but mostly I've been okay"

5. **Ava Interpretation:**
   ```
   #ava Got it - so several days. Let me know if I should change that.

   [Form auto-populated in background: Q1 = "Several days (1)"]

   Next question: How often have you been feeling down, depressed,
   or hopeless?
   ```

6. **User:** "Not really"

7. **Ava:**
   ```
   #ava Okay, I'll mark that as "not at all."

   [Form: Q2 = "Not at all (0)"]

   How about trouble falling asleep, staying asleep, or sleeping
   too much?
   ```

8. **User:** "I've been sleeping too much actually, almost every day"

9. **Ava:**
   ```
   #ava Thanks for sharing that. I'll note "nearly every day."

   [Form: Q3 = "Nearly every day (3)"]

   [Continues through remaining 6 questions with same pattern]
   ```

10. **After Question 9, Ava Summarizes:**
    ```
    #ava Thank you for completing this assessment. Here's what I recorded:

    1. Little interest or pleasure: Several days
    2. Feeling down or hopeless: Not at all
    3. Sleep problems: Nearly every day
    4. Feeling tired: More than half the days
    5. Appetite changes: Several days
    6. Feeling bad about yourself: Not at all
    7. Trouble concentrating: Several days
    8. Moving slowly or restlessly: Not at all
    9. Thoughts of self-harm: Not at all

    Would you like to change any of these before I submit?

    [Button: Submit as-is]
    [Button: Let me review]
    ```

11. **User clicks:** "Submit as-is"

12. **Ava Processing & Results:**
    ```
    #ava ✓ Assessment submitted.

    Your PHQ-9 score is 8, which suggests mild symptoms. This is
    actually an improvement from your last assessment (score was 12).

    I noticed you mentioned sleeping too much nearly every day.
    Would you like me to send a message to your behavioral health
    navigator about this?

    [Button: Yes, send message]
    [Button: No, I'll bring it up later]

    [Collapsed audit block: Completed PHQ-9 assessment - Score: 8]
    ```

---

## Flow 3: Schedule an Appointment

### Traditional UI Path

**Starting Point:** User navigates to Appointments

1. **Appointments Screen**
   - Shows upcoming appointments
   - User clicks "Schedule New Appointment"

2. **Select Provider Type**
   - Radio buttons: RDN (Registered Dietitian) | BHN (Behavioral Health Navigator)
   - User selects RDN

3. **Select Specific Provider**
   - Defaults to assigned RDN
   - Option to select different RDN if available
   - User confirms assigned provider

4. **Select Date & Time**
   - Calendar shows available dates
   - Clicking date shows available time slots for that day
   - User selects: Friday, Dec 15 at 2:00 PM

5. **Select Appointment Mode**
   - Options: Video call | Phone call | In-person (if available)
   - User selects: Video call

6. **Add Appointment Notes (Optional)**
   - Text field: "What would you like to discuss?"
   - User types: "Want to discuss my meal plan for the holidays"

7. **Technical Requirements Check (for video)**
   - System prompts: "Make sure you have a camera, microphone, and stable internet"
   - User acknowledges

8. **Confirm Appointment**
   - Summary shows: Provider, Date/Time, Mode, Notes
   - User clicks "Confirm Appointment"

9. **Confirmation**
   - Success message with calendar invite option
   - Reminder preferences (email/SMS 24 hours before)
   - Appointment appears in list with "Scheduled" status

### Conversational Ava Path

**Starting Point:** User talks to Ava from Dashboard

1. **User:** "I need to talk to my dietitian about the holidays"

2. **Ava Response:**
   ```
   #ava I can help you schedule an appointment with your dietitian,
   Sarah Johnson.

   When works best for you? I can show you her availability.
   ```

3. **User:** "Do you have anything next Friday afternoon?"

4. **Ava:**
   ```
   #ava Yes! Sarah has these times available on Friday, Dec 15:

   • 1:00 PM
   • 2:00 PM
   • 4:30 PM

   Which works for you?
   ```

5. **User:** "2pm is perfect"

6. **Ava:**
   ```
   #ava Great! Would you prefer video call or phone call for this
   appointment?
   ```

7. **User:** "Video is fine"

8. **Ava Confirmation:**
   ```
   #ava Perfect! Let me confirm:

   Appointment with: Sarah Johnson, RDN
   Date & Time: Friday, Dec 15 at 2:00 PM
   Mode: Video call
   Topic: Holiday meal planning

   Should I schedule this for you?

   [Button: Yes, schedule it]
   [Button: Change something]
   ```

9. **User clicks:** "Yes, schedule it"

10. **Ava Final Confirmation:**
    ```
    #ava ✓ Appointment scheduled!

    Friday, Dec 15 at 2:00 PM with Sarah Johnson (video call)

    I'll send you a reminder 24 hours before. The video link will be
    available in your appointments list.

    Quick tech check: You'll need a camera, microphone, and stable
    internet connection. Want me to help you test these before the
    appointment?

    [Button: Test now]
    [Button: I'll do it later]

    [Collapsed audit block: Scheduled appointment - RDN, Dec 15, 2pm]
    ```

---

## Flow 4: Onboarding Flow (New Patient)

### Combined Path (Mix of Form and Ava Assistance)

**Starting Point:** New patient receives welcome email with app link

1. **Welcome Screen**
   - Cena Health branding
   - "Welcome to Cena Health!"
   - Brief intro: "Let's get you set up. This will take about 10 minutes."
   - [Button: Get Started]

2. **Account Creation**
   - Email (pre-filled from invitation)
   - Create password
   - Confirm password
   - Accept terms & privacy policy
   - [Button: Create Account]

3. **Ava Introduction**
   ```
   #ava Hi! I'm Ava, your AI health assistant. I'll be here throughout
   the app to help you with anything you need.

   I can help you set up your profile, answer questions, schedule
   appointments, order meals - pretty much anything in the app!

   Would you like me to guide you through setup, or would you prefer
   to fill out the forms yourself?

   [Button: Guide me, Ava]
   [Button: I'll do it myself]
   ```

4. **Personal Information (If user selects "Guide me")**

   **Ava:** "Let's start with some basic information. What's your full legal name?"

   **User:** "Emily Rodriguez"

   **Ava:** "Thanks, Emily! And what's your date of birth?"

   **User:** "March 15, 1985"

   **Ava:** [Form auto-populates] "Got it. What's your phone number?"

   [Continues through: address, emergency contact, etc.]

5. **Insurance Information**
   ```
   #ava Now let's add your insurance information so we can verify your
   coverage.

   Do you have your insurance card handy? You can either tell me the
   details or upload a photo.

   [Button: Upload photo]
   [Button: Enter manually]
   ```

   **User uploads photo**

   **Ava:**
   ```
   #ava Perfect! I can see this is Blue Cross Blue Shield. Let me pull
   the details...

   [Processing...]

   I found:
   • Insurance Company: Blue Cross Blue Shield
   • Member ID: ABC123456789
   • Group Number: 987654

   Does this look right?
   [Button: Yes, correct]
   [Button: Let me fix something]
   ```

6. **Dietary Preferences & Allergies**
   ```
   #ava This part is really important - let's talk about food!

   Do you have any food allergies?
   ```

   **User:** "I'm allergic to shellfish and tree nuts"

   **Ava:**
   ```
   #ava Got it - I'll make sure we never send you meals with shellfish
   or tree nuts. This is really important for your safety.

   How about dietary preferences? For example, do you avoid certain
   foods for religious, ethical, or health reasons?
   ```

   **User:** "I don't eat pork"

   **Ava:**
   ```
   #ava Noted! Any foods you just really don't like? These won't show
   up in your meal recommendations.
   ```

   **User:** "I hate mushrooms and I'm not a fan of Brussels sprouts"

   **Ava:** "Perfect! No mushrooms or Brussels sprouts. Anything else?"

7. **Health Goals**
   ```
   #ava Your care team will work with you to create a full care plan,
   but I'd love to hear - what are you hoping to achieve with Cena Health?
   ```

   **User:** "I need to lower my A1C and lose about 30 pounds"

   **Ava:**
   ```
   #ava Those are great goals! We'll help you get there. I've noted:
   • Reduce A1C levels
   • Lose 30 pounds

   Your dietitian will help you create a detailed plan during your
   first appointment.

   Speaking of which - would you like to schedule your first
   appointment now?

   [Button: Yes, schedule now]
   [Button: I'll do it later]
   ```

8. **Device Connection (Optional)**
   ```
   #ava One more thing - do you use any health tracking devices like
   a smartwatch, fitness tracker, or smart scale?

   We can connect them to automatically track your health data.

   [Button: Connect a device]
   [Button: Skip for now]
   ```

9. **Notification Preferences**
   - Quick form with toggles for notification types
   - Ava assists: "I recommend keeping appointment reminders on - I'll send them 24 hours before"

10. **Setup Complete**
    ```
    #ava ✓ You're all set, Emily!

    Here's what we completed:
    ✓ Account created
    ✓ Personal information
    ✓ Insurance verified
    ✓ Dietary preferences saved (no shellfish, tree nuts, pork, mushrooms, or Brussels sprouts)
    ✓ Health goals recorded
    ✓ Notifications configured

    Next steps:
    1. Schedule your first dietitian appointment (I can help!)
    2. Complete your initial health assessment
    3. Place your first meal order

    What would you like to do first?

    [Button: Schedule appointment]
    [Button: Complete assessment]
    [Button: Explore the app]
    ```

---

## Flow 5: Log Health Data with Device Integration

### Scenario A: Manual Entry (Traditional UI)

**Starting Point:** User navigates to My Health > Health Data

1. **Health Data Dashboard**
   - Shows charts for all tracked metrics
   - Each metric has "+ Log New Entry" button
   - User clicks "+ Log New Entry" under Weight

2. **Weight Entry Form**
   - Weight: [Input field] lbs/kg toggle
   - Date: [Date picker] - defaults to today
   - Time: [Time picker] - defaults to current time
   - Notes (optional): [Text field]
   - User enters: 168 lbs
   - User clicks "Save"

3. **Confirmation**
   - Entry added to weight chart
   - Chart updates to show new data point
   - Trend indicator shows: ↓ 2 lbs from last entry

### Scenario B: Conversational Entry (Ava)

**Starting Point:** User talks to Ava from anywhere

1. **User:** "I weighed myself this morning, 168 pounds"

2. **Ava:**
   ```
   #ava ✓ Logged: 168 lbs this morning

   That's down 2 pounds from your last entry! Great progress toward
   your 30-pound goal. You're now 8 pounds down overall.

   [Collapsed audit block: Logged weight - 168 lbs]
   ```

### Scenario C: Device Sync

**Starting Point:** User has connected smart scale

1. **User Steps on Scale**
   - Smart scale measures: 168.2 lbs, body fat 28%, BMI 26.4
   - Scale syncs to cloud

2. **Background Sync**
   - Cena app polls device API
   - Retrieves new measurement
   - Automatically adds entry to Health Data

3. **Ava Notification**
   ```
   #ava I noticed your scale synced new data:
   • Weight: 168.2 lbs (down 1.8 from last week)
   • Body fat: 28%
   • BMI: 26.4

   Your weight trend is looking great! You're averaging 0.8 lbs lost
   per week, which is healthy and sustainable.

   [Collapsed audit block: Device sync - Weight data from Withings Scale]
   ```

### Scenario D: Multi-Metric Voice Entry

**Starting Point:** User voice-activates Ava

1. **User (speaking):** "Log my vitals: weight 168, blood pressure 118 over 76, resting heart rate 68"

2. **Ava:**
   ```
   #ava Got it! Let me confirm:

   • Weight: 168 lbs
   • Blood pressure: 118/76 mmHg
   • Resting heart rate: 68 bpm

   All measured today at [current time]?

   [Button: Yes, log all]
   [Button: Let me change something]
   ```

3. **User clicks:** "Yes, log all"

4. **Ava:**
   ```
   #ava ✓ All vitals logged!

   Your blood pressure and heart rate are both in healthy ranges.
   Your BP has been consistently good - nice work!

   [Collapsed audit block: Logged vitals - Weight, BP, HR]
   ```

---

## Flow 6: Handle Device Connection Issue

### Problem Scenario: Device Stops Syncing

**Starting Point:** User's connected device hasn't synced in 3 days

1. **Ava Proactive Alert (on Device Integration page):**
   ```
   #ava #greeting I noticed your Withings scale hasn't synced in 3 days.
   This might mean there's a connection issue.

   Common fixes:
   • Make sure the scale is connected to WiFi
   • Check that the Withings app is still authorized
   • Try reconnecting the device

   Would you like me to walk you through reconnecting?

   [Button: Help me reconnect]
   [Button: I'll fix it myself]
   ```

2. **User clicks:** "Help me reconnect"

3. **Ava Troubleshooting:**
   ```
   #ava Let's fix this together.

   First, is your scale showing a WiFi symbol when you step on it?
   ```

4. **User:** "No, it's not showing WiFi"

5. **Ava:**
   ```
   #ava Okay, that's the issue. The scale lost its WiFi connection.

   Here's how to reconnect it:

   1. Open the Withings Health Mate app on your phone
   2. Go to Devices > Select your scale
   3. Tap "WiFi" and choose your network
   4. Enter your WiFi password when prompted

   Let me know when you've done that, and we'll test the connection.
   ```

6. **User (5 minutes later):** "Okay, I reconnected it to WiFi"

7. **Ava:**
   ```
   #ava Perfect! Now step on the scale so it can take a measurement
   and sync it to the cloud. This will test the connection.
   ```

8. **User steps on scale → data syncs**

9. **Ava:**
   ```
   #ava ✓ It's working! I just received your weight data (168.4 lbs).

   Your scale is now reconnected and will sync automatically going
   forward.

   [Collapsed audit block: Reconnected device - Withings Scale]
   ```

---

## Notes

- All flows include both traditional and conversational paths where applicable
- Ava maintains context throughout multi-turn conversations
- Audit trail blocks appear after any action that modifies data
- Users can switch between traditional UI and conversational interface mid-flow
- All Ava confirmations require explicit user approval before submitting data
- Conversational flows prioritize accessibility and natural language
