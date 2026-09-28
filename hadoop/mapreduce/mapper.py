#!/usr/bin/env python3
import sys

for line in sys.stdin:
    line = line.strip()

    if line.startswith("date,"):
        continue

    parts = line.split(",")

    if len(parts) == 3:
        product_id = parts[1]
        quantity = parts[2]
        print(f"{product_id}\t{quantity}")
