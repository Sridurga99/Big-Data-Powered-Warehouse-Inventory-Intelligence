#!/usr/bin/env python3
import sys

current_product = None
current_total = 0

for line in sys.stdin:
    line = line.strip()

    if not line:
        continue

    product_id, quantity = line.split("\t")

    if current_product == product_id:
        current_total += int(quantity)
    else:
        if current_product is not None:
            print(f"{current_product}\t{current_total}")

        current_product = product_id
        current_total = int(quantity)

if current_product is not None:
    print(f"{current_product}\t{current_total}")
