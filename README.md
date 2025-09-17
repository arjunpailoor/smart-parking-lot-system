# Smart Parking Lot System

This is a **Node.js backend project** simulating a smart parking lot system. It allows vehicles to enter and exit the parking lot, calculates parking fees based on duration, and keeps track of available slots for each vehicle type.

---

## Features
- Vehicle entry and exit with slot allocation
- Dynamic parking fee calculation based on vehicle type and duration
- Prevents duplicate vehicle entries
- Shows available parking slots after each entry/exit
- Supports multiple vehicle types:
  - `large vehicle`
  - `car`
  - `bike`

## Test
- Run node server.js
- enter the URL http://localhost:3000/parking/entry in Postman with POST request.
- input vehicle number and type i.e. large vehicle, car, bike and observe the output which displays parking floor, parking slot and available slots left
- input already existing vehicle number and observe output, it should display invalid input and the duplicate vehicle number has been entered
- input other incomplete invalid details and observe output.

- enter the URL http://localhost:3000/parking/exit in Postman with POST request.
- input vehicle number and payment mode and observe the output which displays vehicle exit message and fee based on extry and exit time duration and the available slots left
- input duplicate vehicle number or invalid vehicle number or a vehicle number that's currently not in the parking lot and observe invalid messages.

