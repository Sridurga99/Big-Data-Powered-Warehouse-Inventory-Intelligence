#!/bin/bash

STREAMING_JAR="$HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-3.5.0.jar"
INPUT="/warehouse_inventory/sales/sales.csv"
OUTPUT="/warehouse_inventory/processed/sales_by_product"

hdfs dfs -rm -r -f "$OUTPUT"

hadoop jar "$STREAMING_JAR" \
-input "$INPUT" \
-output "$OUTPUT" \
-mapper "$PWD/hadoop/mapreduce/mapper.py" \
-reducer "$PWD/hadoop/mapreduce/reducer.py"

hdfs dfs -cat "$OUTPUT/part-00000"
