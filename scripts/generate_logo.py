import cv2

# Let's construct a clean SVG file from contours with cubic Bezier or polygon smoothing
def contours_to_svg(contours, hierarchy, width, height, output_path="logo.svg"):
    svg_header = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="100%">\n'
    svg_header += '  <g fill="#000000" fill-rule="evenodd">\n'
    
    path_data = ""
    
    if hierarchy is not None:
        hierarchy = hierarchy[0]
        for i, cnt in enumerate(contours):
            # Smooth contour slightly
            epsilon = 0.001 * cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, epsilon, True)
            
            pts = approx.reshape(-1, 2)
            if len(pts) < 3:
                continue
                
            d = f"M {pts[0][0]} {pts[0][1]} "
            for pt in pts[1:]:
                d += f"L {pt[0]} {pt[1]} "
            d += "Z "
            path_data += f"    <path d=\"{d.strip()}\" />\n"
            
    svg_footer = "  </g>\n</svg>"
    
    with open(output_path, "w") as f:
        f.write(svg_header + path_data + svg_footer)
    print(f"Saved SVG to {output_path}")

# Example of how you would call it:
# contours, hierarchy = cv2.findContours(thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
# contours_to_svg(contours, hierarchy, thresh.shape[1], thresh.shape[0], "ac_engine_logo.svg")
