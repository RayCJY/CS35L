(defun gps-line ()
  "Print the current buffer line number and the total number of lines."
  (interactive)
  (let ((start (point-min))
        (n (line-number-at-pos))
        (m 0))
    (save-excursion
      (goto-char (point-min))
      (while (re-search-forward "\n" nil t 1)
        (setq m (+ 1 m))))
    (if (= start 1)
        (message "Line %d/%d" n m)
      (save-excursion
        (save-restriction
          (widen)
          (let ((total 0))
            (goto-char (point-min))
            (while (re-search-forward "\n" nil t 1)
              (setq total (+ 1 total)))
            (message "line %d/%d (narrowed line %d/%d)"
                     (+ n (line-number-at-pos start) -1)
                     total
                     n
                     m)))))))
