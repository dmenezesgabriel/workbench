import tkinter as tk
import bluetooth
import time

# HID Keyboard Report Descriptor
report_descriptor = [
    0x05, 0x01,  # Usage Page (Generic Desktop Ctrls)
    0x09, 0x06,  # Usage (Keyboard)
    0xa1, 0x01,  # Collection (Application)
    0x05, 0x07,  # Usage Page (Kbrd/Keypad)
    0x19, 0xe0,  # Usage Minimum (0xE0)
    0x29, 0xe7,  # Usage Maximum (0xE7)
    0x15, 0x00,  # Logical Minimum (0)
    0x25, 0x01,  # Logical Maximum (1)
    0x75, 0x01,  # Report Size (1)
    0x95, 0x08,  # Report Count (8)
    0x81, 0x02,  # Input (Data,Var,Abs,No Wrap,Linear,Preferred State,No Null Position)
    0x95, 0x01,  # Report Count (1)
    0x75, 0x08,  # Report Size (8)
    0x81, 0x01,  # Input (Const,Array,Abs,No Wrap,Linear,Preferred State,No Null Position)
    0x95, 0x05,  # Report Count (5)
    0x75, 0x01,  # Report Size (1)
    0x05, 0x08,  # Usage Page (LEDs)
    0x19, 0x01,  # Usage Minimum (Num Lock)
    0x29, 0x05,  # Usage Maximum (Kana)
    0x91, 0x02,  # Output (Data,Var,Abs,No Wrap,Linear,Preferred State,No Null Position,Non Volatile)
    0x95, 0x01,  # Report Count (1)
    0x75, 0x03,  # Report Size (3)
    0x91, 0x01,  # Output (Const,Array,Abs,No Wrap,Linear,Preferred State,No Null Position,Non Volatile)
    0x95, 0x06,  # Report Count (6)
    0x75, 0x08,  # Report Size (8)
    0x15, 0x00,  # Logical Minimum (0)
    0x25, 0x65,  # Logical Maximum (101)
    0x05, 0x07,  # Usage Page (Kbrd/Keypad)
    0x19, 0x00,  # Usage Minimum (0x00)
    0x29, 0x65,  # Usage Maximum (0x65)
    0x81, 0x00,  # Input (Data,Array,Abs,No Wrap,Linear,Preferred State,No Null Position)
    0xc0  # End Collection
]

# Bluetooth HID Service UUID
service_uuid = "00001124-0000-1000-8000-00805f9b34fb"

# Bluetooth HID Device Name
device_name = "Emulated HID Keyboard"

class HIDKeyboardEmulator:
    def __init__(self):
        self.is_advertising = False
        self.root = tk.Tk()
        self.root.geometry("800x400")
        self.root.title("Bluetooth HID Keyboard Emulator")

        self.toolbar = tk.Frame(self.root)
        self.toolbar.pack(side=tk.TOP, fill=tk.X)

        self.advertise_button = tk.Button(self.toolbar, text="Advertise", command=self.start_advertising)
        self.advertise_button.pack(side=tk.LEFT)

        self.stop_advertise_button = tk.Button(self.toolbar, text="Stop Advertising", command=self.stop_advertising)
        self.stop_advertise_button.pack(side=tk.LEFT)

        self.quit_button = tk.Button(self.toolbar, text="Quit", command=self.quit_program)
        self.quit_button.pack(side=tk.LEFT)

        self.keyboard_frame = tk.Frame(self.root)
        self.keyboard_frame.pack(fill=tk.BOTH, expand=True)
        self.keyboard_buttons = {}
        self.keyboard_frame.bind("<KeyPress>", self.send_key)
        self.keyboard_frame.bind("<KeyRelease>", self.release_key)
        self.keyboard_frame.focus_set()

        self.create_keyboard_buttons()

    def create_keyboard_buttons(self):
        row_labels = [
            "` 1 2 3 4 5 6 7 8 9 0 - =",
            "q w e r t y u i o p [ ] \\",
            "a s d f g h j k l ; '",
            "z x c v b n m , . /",
        ]

        row_idx = 0
        for row in row_labels:
            col_idx = 0
            keys = row.split()
            for key in keys:
                button = tk.Button(
                    self.keyboard_frame,
                    text=key,
                    width=3,
                    command=lambda key=key: self.send_key_press(key),
                    relief=tk.RAISED,
                )
                button.grid(row=row_idx, column=col_idx, padx=2, pady=2)
                self.keyboard_buttons[key] = button
                col_idx += 1
            row_idx += 1

    def send_key(self, event):
        key = event.keysym.lower()
        if key in self.keyboard_buttons:
            self.keyboard_buttons[key].configure(relief=tk.SUNKEN)
            self.keyboard_buttons[key].update_idletasks()

            if self.is_advertising:
                self.send_hid_report(key, 0x01)  # Key Press

    def release_key(self, event):
        key = event.keysym.lower()
        if key in self.keyboard_buttons:
            self.keyboard_buttons[key].configure(relief=tk.RAISED)
            self.keyboard_buttons[key].update_idletasks()

            if self.is_advertising:
                self.send_hid_report(key, 0x00)  # Key Release

    def send_hid_report(self, key, modifier):
        report = [modifier, 0x00, ord(key), 0x00, 0x00, 0x00, 0x00, 0x00]
        report_data = "".join([chr(x) for x in report])
        bluetooth.hid_send_service_data(report_data)

    def start_advertising(self):
        if not self.is_advertising:
            self.is_advertising = True
            self.advertise_button.configure(state=tk.DISABLED)
            self.stop_advertise_button.configure(state=tk.NORMAL)

            # Create a Bluetooth HID descriptor
            hid_descriptor = bluetooth.hid_descriptor(report_descriptor)

            # Create a Bluetooth HID service record
            hid_service_record = bluetooth.hid_service_record(
                hid_descriptor,
                service_name=device_name,
                service_uuid=service_uuid,
                psm=17,
                provider="PythonEmulator",
            )

            # Create a Bluetooth SDP record
            sdp_record = bluetooth.build_sdp_record(hid_service_record)

            # Register the Bluetooth SDP record
            bluetooth.register_service(sdp_record)

            print("Bluetooth HID Keyboard Emulator is now advertising.")

    def stop_advertising(self):
        if self.is_advertising:
            self.is_advertising = False
            self.advertise_button.configure(state=tk.NORMAL)
            self.stop_advertise_button.configure(state=tk.DISABLED)

            # Unregister the Bluetooth SDP record
            bluetooth.unregister_service(service_uuid)

            print("Bluetooth HID Keyboard Emulator stopped advertising.")

    def quit_program(self):
        self.stop_advertising()
        self.root.destroy()

    def send_key_press(self, key):
        if self.is_advertising:
            self.send_hid_report(key, 0x01)  # Key Press
            time.sleep(0.1)
            self.send_hid_report(key, 0x00)  # Key Release

if __name__ == "__main__":
    hid_emulator = HIDKeyboardEmulator()
    hid_emulator.root.mainloop()
