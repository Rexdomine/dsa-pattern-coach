const SAMPLES = [
  ['two-sum','Two Sum','Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'],
  ['contains-duplicate','Contains Duplicate','Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.'],
  ['valid-anagram','Valid Anagram','Given two strings s and t, return true if t is an anagram of s, and false otherwise.'],
  ['group-anagrams','Group Anagrams','Given an array of strings strs, group the anagrams together. You can return the answer in any order.'],
  ['valid-palindrome','Valid Palindrome','Given a string s, return true if it is a palindrome, considering only alphanumeric characters and ignoring cases.'],
  ['max-profit','Best Time to Buy and Sell Stock','Given an array prices where prices[i] is the price of a stock on day i, return the maximum profit you can achieve by choosing one day to buy and a future day to sell.'],
  ['longest-substring','Longest Substring Without Repeating Characters','Given a string s, find the length of the longest substring without repeating characters.'],
  ['product-except-self','Product of Array Except Self','Given an integer array nums, return an array answer such that answer[i] is the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using division.'],
  ['valid-parentheses','Valid Parentheses','Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.'],
  ['daily-temperatures','Daily Temperatures','Given an array of integers temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.'],
  ['number-islands','Number of Islands','Given an m x n 2D grid of 1s and 0s, return the number of islands.'],
  ['max-depth','Maximum Depth of Binary Tree','Given the root of a binary tree, return its maximum depth.'],
  ['invert-tree','Invert Binary Tree','Given the root of a binary tree, invert the tree, and return its root.'],
  ['binary-search','Binary Search','Given a sorted array of integers nums and an integer target, return the index of target. If target does not exist, return -1.'],
  ['merge-intervals','Merge Intervals','Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals.']
];

const PATTERNS = {
  hash: {name:'Hash Map / Set', words:['duplicate','frequency','count','anagram','group','pair','target','sum','seen','lookup','unique','appears','contains','complement','distinct'], why:'This pattern fits when the problem needs fast lookup, counting, grouping, or detecting if something has been seen before.'},
  two: {name:'Two Pointers', words:['sorted','palindrome','reverse','merge','remove duplicates','in-place','left','right','both ends','alphanumeric','buy','sell','profit'], why:'This pattern fits when we can scan from two positions or maintain a best previous position while moving through ordered data.'},
  window: {name:'Sliding Window', words:['substring','subarray','contiguous','longest','shortest','minimum','maximum','window','length','without repeating'], why:'This pattern fits when the answer is a contiguous range that grows and shrinks while maintaining a rule.'},
  stack: {name:'Stack', words:['parentheses','brackets','valid expression','nested','backspace','undo','stack','closing','opening','warmer','temperature','next greater'], why:'This pattern fits when the most recent unresolved item should be handled first: brackets, monotonic comparisons, undo/backspace, or next-greater problems.'},
  graph: {name:'Tree / Graph Traversal', words:['tree','graph','node','edge','root','leaf','path','island','grid','connected','component','level order','shortest path','matrix','dfs','bfs','depth','invert'], why:'This pattern fits when the input is a tree, graph, grid, or connected structure that needs visiting nodes/cells.'},
  binary: {name:'Binary Search', words:['sorted array','binary search','search','target','log n','rotated','minimum in sorted'], why:'This pattern fits when the input is sorted or monotonic and each comparison can eliminate half of the search space.'},
  intervals: {name:'Intervals', words:['interval','intervals','overlap','meeting','merge','start','end'], why:'This pattern fits when the problem is about ranges, overlap, start/end points, or merging time blocks.'},
  prefix: {name:'Prefix / Suffix', words:['product except self','except self','without using division','prefix','suffix','left product','right product'], why:'This pattern fits when each answer depends on everything before and after an index, so we precompute left-side and right-side information.'}
};

function sol(id,title,pattern,why,brute,steps,code,lines,tests,complexity,challenges,aliases=[]){return {id,title,pattern,why,brute,steps,code,lines,tests,complexity,challenges,aliases};}
const LIB = [
sol('two-sum','Two Sum — End-to-End Solution','Hash Map / Set','We need to quickly know whether the complement needed to reach target has already appeared. A hash map gives average O(1) lookup.','Try every pair of numbers with nested loops and check whether they sum to target. That is O(n²).',[
'Create a dictionary seen mapping number to index.','Loop through nums using enumerate.','For each value, calculate complement = target - value.','If complement is already in seen, return the previous index and current index.','Otherwise store the current value and index.'
],`def two_sum(nums, target):
    seen = {}

    for index, value in enumerate(nums):
        complement = target - value

        if complement in seen:
            return [seen[complement], index]

        seen[value] = index

    return []`,[
'I create a dictionary called seen to store numbers I have visited and their indices.','I loop with enumerate so I have both the index and value.','For each number, I calculate the complement needed to reach target.','If the complement is already in seen, I found the pair and return both indices.','If not, I store the current value for future checks.'
],['[2,7,11,15], target=9 -> [0,1]','[3,2,4], target=6 -> [1,2]','[3,3], target=6 -> [0,1]'],'Time O(n), space O(n).',['Why hash map? It removes repeated pair scans by making complement lookup O(1).','Why not sort? Sorting loses original indices unless extra tracking is added and is O(n log n).','Duplicates work because we check before storing the current value.'],['two numbers','add up to target','indices']),

sol('contains-duplicate','Contains Duplicate — End-to-End Solution','Hash Map / Set','We only need to know if a value has appeared before. A set is perfect for fast membership checks.','Compare every number against every other number, O(n²).',[
'Create an empty set called seen.','Loop through every number.','If the number is already in seen, return True.','Otherwise add it to seen.','If the loop finishes, return False.'
],`def contains_duplicate(nums):
    seen = set()

    for num in nums:
        if num in seen:
            return True
        seen.add(num)

    return False`,['I use a set because I only care whether a number has appeared before.','For every number, I check membership in the set.','If it exists, we found a duplicate.','If not, I add it and continue.','If no duplicate appears, I return False.'],['[1,2,3,1] -> True','[1,2,3,4] -> False','[] -> False'],'Time O(n), space O(n).',['Why set? Average O(1) membership.','Could sorting work? Yes, but O(n log n) and may mutate data.'],['appears at least twice','distinct','duplicate']),

sol('valid-anagram','Valid Anagram — End-to-End Solution','Hash Map / Set','Anagrams require equal character frequencies, so counting characters solves the problem directly.','For each char, search/remove it from the other string, which is inefficient.',[
'If lengths differ, return False.','Build a frequency map from s.','Loop through t and decrement counts.','If a char is missing or used up, return False.','Return True after all chars match.'
],`def is_anagram(s, t):
    if len(s) != len(t):
        return False

    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1

    for ch in t:
        if ch not in counts or counts[ch] == 0:
            return False
        counts[ch] -= 1

    return True`,['I check length first because anagrams must have the same number of characters.','I count each character in the first string.','Then I walk through the second string and consume those counts.','If a needed character is missing or exhausted, it is not an anagram.','If everything balances, I return True.'],['s="anagram", t="nagaram" -> True','s="rat", t="car" -> False','s="", t="" -> True'],'Time O(n), space O(k), where k is unique characters.',['Why not sorting? Sorting is O(n log n); counting is O(n).','Case sensitivity depends on the prompt; ask if needed.'],['anagram']),

sol('group-anagrams','Group Anagrams — End-to-End Solution','Hash Map / Set','We group words by a shared signature. A dictionary maps each signature to all words with that signature.','Compare every word to every other word, which is slow.',[
'Create a dictionary groups.','For each word, sort its letters to create a key.','Append the word into groups[key].','Return all grouped values.'
],`def group_anagrams(strs):
    groups = {}

    for word in strs:
        key = ''.join(sorted(word))
        if key not in groups:
            groups[key] = []
        groups[key].append(word)

    return list(groups.values())`,['I create a dictionary for anagram groups.','Sorting a word gives the same key for all its anagrams.','I create a list when a key appears for the first time.','Then I append the word to that list.','Finally I return all groups.'],['["eat","tea","tan","ate","nat","bat"] -> grouped anagrams','[""] -> [[""]]'],'Time O(n*m log m), space O(n*m).',['Could use a 26-count tuple instead of sorting for lowercase letters.','Dictionary is useful because grouping by key is direct.'],['group anagrams','group the anagrams','group strings by anagram']),

sol('valid-palindrome','Valid Palindrome — End-to-End Solution','Two Pointers','A palindrome compares matching characters from both ends moving inward.','Clean the string and compare it with its reverse; works but uses extra space.',[
'Set left at start and right at end.','Skip non-alphanumeric characters on both sides.','Compare lowercase characters.','If they differ, return False.','Move inward until pointers cross, then return True.'
],`def is_palindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True`,['I place one pointer at the beginning and one at the end.','I skip characters that do not count.','I compare lowercase characters to ignore case.','If they differ, it cannot be a palindrome.','If they match, I move inward.','If all comparisons pass, I return True.'],['"A man, a plan, a canal: Panama" -> True','"race a car" -> False','"" -> True'],'Time O(n), space O(1).',['Why two pointers? It avoids building a cleaned reversed copy.','Punctuation is ignored using isalnum().'],['palindrome']),

sol('max-profit','Best Time to Buy and Sell Stock — End-to-End Solution','Two Pointers','We need the best earlier buy price and current selling price as we scan once.','Try every buy/sell pair, O(n²).',[
'Track min_price seen so far.','Track best_profit.','For each price, compute price - min_price.','Update best_profit.','Update min_price when we see a lower price.'
],`def max_profit(prices):
    min_price = float('inf')
    best_profit = 0

    for price in prices:
        best_profit = max(best_profit, price - min_price)
        min_price = min(min_price, price)

    return best_profit`,['I keep the lowest buy price seen so far.','For each day, I calculate profit if I sell today.','I update the best profit if today is better.','Then I update the minimum price for future days.','This respects the rule that buying must happen before selling.'],['[7,1,5,3,6,4] -> 5','[7,6,4,3,1] -> 0'],'Time O(n), space O(1).',['Why not nested loops? One scan is enough because only the best prior buy matters.','Why initialize profit to 0? Because we can choose not to trade if no profit exists.'],['stock','buy','sell','profit']),

sol('longest-substring','Longest Substring Without Repeating Characters — End-to-End Solution','Sliding Window','We need the longest contiguous substring that stays valid without duplicate characters.','Generate every substring and check duplicates, O(n²) or worse.',[
'Use left pointer for window start.','Use a set for characters in the current window.','Move right through the string.','While the new char is duplicated, shrink from left.','Add char and update best length.'
],`def length_of_longest_substring(s):
    left = 0
    seen = set()
    best = 0

    for right, ch in enumerate(s):
        while ch in seen:
            seen.remove(s[left])
            left += 1

        seen.add(ch)
        best = max(best, right - left + 1)

    return best`,['I keep a left pointer for the start of the valid window.','The set represents characters currently inside the window.','As right expands, I check whether the new character breaks the rule.','If it repeats, I shrink from the left until the duplicate is gone.','Then I update the best length.'],['"abcabcbb" -> 3','"bbbbb" -> 1','"pwwkew" -> 3','"" -> 0'],'Time O(n), space O(k), at most O(n).',['Why sliding window? The substring is contiguous and can be maintained as a range.','Why while loop? It restores the no-duplicate invariant.'],['longest substring','without repeating']),

sol('min-subarray','Minimum Size Subarray Sum — End-to-End Solution','Sliding Window','Positive numbers allow us to expand until sum is enough, then shrink to minimize length.','Check every subarray sum, O(n²).',[
'Initialize left, current_sum, and best length.','Expand right and add nums[right].','While current_sum >= target, update best and shrink left.','Return 0 if best was never updated.'
],`def min_sub_array_len(target, nums):
    left = 0
    current_sum = 0
    best = float('inf')

    for right, value in enumerate(nums):
        current_sum += value

        while current_sum >= target:
            best = min(best, right - left + 1)
            current_sum -= nums[left]
            left += 1

    return 0 if best == float('inf') else best`,['I maintain a running sum for the current window.','I expand the window by moving right.','Once the sum reaches target, I try to shrink from the left to get the shortest valid window.','Each time it is valid, I update best.','If no window works, I return 0.'],['target=7, nums=[2,3,1,2,4,3] -> 2','target=4, nums=[1,4,4] -> 1','target=11, nums=[1,1,1,1] -> 0'],'Time O(n), space O(1).',['Why positive integers matter? Shrinking decreases sum predictably.','Why sliding window? We need a contiguous subarray.'],['minimum size subarray','minimum size subarray sum','minimal length','sum greater than or equal','positive integer target']),

sol('product-except-self','Product of Array Except Self — End-to-End Solution','Prefix / Suffix','Each output index needs the product of everything before it and everything after it, without using division. Prefix and suffix products give that in O(n).','For each index, multiply every other element with a nested loop. That is O(n²).',[
'Create an answer array initialized with 1s.','Make a left-to-right pass storing the product of all numbers before each index.','Make a right-to-left pass with a suffix product.','Multiply answer[i] by the suffix product after i.','Return the answer array.'
],`def product_except_self(nums):
    answer = [1] * len(nums)

    prefix = 1
    for i in range(len(nums)):
        answer[i] = prefix
        prefix *= nums[i]

    suffix = 1
    for i in range(len(nums) - 1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]

    return answer`,['I initialize answer with 1s because multiplication identity is 1.','The prefix variable stores the product of all values to the left of the current index.','On the first pass, I save that left product into answer[i], then update prefix with nums[i].','The suffix variable stores the product of all values to the right of the current index.','On the second pass from right to left, I multiply answer[i] by the right-side product.','Then I update suffix with nums[i].','This avoids division and handles zeros naturally.'],['[1,2,3,4] -> [24,12,8,6]','[-1,1,0,-3,3] -> [0,0,9,0,0]','[0,0] -> [0,0]'],'Time O(n), space O(1) extra if output array is not counted, otherwise O(n).',['Why prefix/suffix? Each index needs products on both sides, and division is not allowed.','Why two passes? One pass collects left products; the second pass combines right products.','How are zeros handled? Prefix/suffix multiplication naturally produces correct zeros without special cases.'],['product except self','except nums i','without using division','answer i is the product']),

sol('valid-parentheses','Valid Parentheses — End-to-End Solution','Stack','Bracket validation is last-in, first-out: the most recent opening bracket must close first.','Repeatedly remove matching pairs; inefficient and messy.',[
'Create a stack and closing-to-opening map.','Push opening brackets.','For closing brackets, stack top must match.','If not, return False.','At the end, stack must be empty.'
],`def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for ch in s:
        if ch in '([{':
            stack.append(ch)
        else:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()

    return len(stack) == 0`,['I use a stack for unresolved opening brackets.','The pairs map tells me what opening bracket each closing bracket needs.','Opening brackets are pushed.','When I see a closing bracket, the most recent opening must match.','If it does, I pop it.','At the end, no unresolved brackets should remain.'],['"()" -> True','"()[]{}" -> True','"(]" -> False','"([)]" -> False'],'Time O(n), space O(n).',['Why stack? Matching nested brackets is LIFO.','What if it starts with closing bracket? Stack is empty, so False.'],['parentheses','brackets','valid']),

sol('daily-temperatures','Daily Temperatures — End-to-End Solution','Stack','We need the next warmer future day. A monotonic stack keeps unresolved colder days.','For each day scan forward until warmer, O(n²).',[
'Create answer array of zeros.','Use stack to store indices of days waiting for warmer temperature.','For each current temperature, resolve all colder previous days.','Set answer[prev] = current_index - prev.','Push current index.'
],`def daily_temperatures(temperatures):
    answer = [0] * len(temperatures)
    stack = []

    for i, temp in enumerate(temperatures):
        while stack and temp > temperatures[stack[-1]]:
            prev = stack.pop()
            answer[prev] = i - prev
        stack.append(i)

    return answer`,['I initialize the answer with zeros because some days may never get warmer.','The stack stores indices that are waiting for a warmer day.','When today is warmer than the day on top of the stack, I can resolve that previous day.','The wait is current index minus previous index.','Then I push today as unresolved.'],['[73,74,75,71,69,72,76,73] -> [1,1,4,2,1,1,0,0]'],'Time O(n), space O(n).',['Why monotonic stack? Each index waits until a greater future value appears.','Each day is pushed and popped at most once.'],['daily temperatures','warmer temperature','next greater']),

sol('number-islands','Number of Islands — End-to-End Solution','Tree / Graph Traversal','A grid of land/water is a graph. Each island is a connected component.','Without visited tracking, cells may be counted repeatedly.',[
'Loop through every cell.','When an unvisited land cell is found, increment count.','Run DFS to mark that full island as visited.','Continue scanning for new islands.'
],`def num_islands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    visited = set()

    def dfs(r, c):
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            grid[r][c] == '0' or (r, c) in visited):
            return

        visited.add((r, c))
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and (r, c) not in visited:
                count += 1
                dfs(r, c)

    return count`,['I treat the grid as a graph where land cells connect vertically and horizontally.','I use visited so I do not count the same island twice.','DFS explores all connected land from a starting cell.','Every time the main loop finds new unvisited land, that means a new island starts.','After DFS, the entire island is marked.'],['One connected block -> 1','Separated land groups -> count of groups','All water -> 0','Empty grid -> 0'],'Time O(rows*cols), space O(rows*cols).',['Why DFS/BFS? Islands are connected components.','Can mutate grid? Yes, if allowed, mark land as water instead of visited set.'],['island','grid','connected land']),

sol('max-depth','Maximum Depth of Binary Tree — End-to-End Solution','Tree / Graph Traversal','Tree depth is naturally computed by DFS: depth is 1 plus the deeper subtree.','No better than visiting each node once; BFS can also count levels.',[
'If root is None, return 0.','Compute left depth recursively.','Compute right depth recursively.','Return 1 + max(left, right).'
],`def max_depth(root):
    if root is None:
        return 0

    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)

    return 1 + max(left_depth, right_depth)`,['If the node is None, it contributes zero depth.','I recursively calculate depth on the left subtree.','I recursively calculate depth on the right subtree.','The current node adds one level to the deeper side.'],['Empty tree -> 0','Single node -> 1','Unbalanced tree -> longest path length'],'Time O(n), space O(h) recursion stack.',['Why DFS? A subtree depth depends on child depths.','Could BFS work? Yes, count levels with a queue.'],['maximum depth','max depth','binary tree depth']),

sol('invert-tree','Invert Binary Tree — End-to-End Solution','Tree / Graph Traversal','To invert a tree, every node swaps its left and right children, then we recursively invert children.','Visit nodes and manually rebuild a new tree; uses extra structure.',[
'If root is None, return None.','Swap root.left and root.right.','Recursively invert the left subtree.','Recursively invert the right subtree.','Return root.'
],`def invert_tree(root):
    if root is None:
        return None

    root.left, root.right = root.right, root.left
    invert_tree(root.left)
    invert_tree(root.right)

    return root`,['I handle the empty tree first.','At each node, I swap left and right children.','Then I recursively apply the same process to both children.','Finally I return the root of the inverted tree.'],['Empty tree -> None','Single node -> same node','[4,2,7,1,3,6,9] -> [4,7,2,9,6,3,1]'],'Time O(n), space O(h).',['Why recursion? The same operation applies to every subtree.','Why return root? The tree is modified in place.'],['invert tree','invert binary tree','invert the tree','return its root']),

sol('binary-search','Binary Search — End-to-End Solution','Binary Search','The array is sorted, so each middle comparison eliminates half the search space.','Linear scan checks every item, O(n).',[
'Set left=0 and right=len(nums)-1.','While left <= right, compute mid.','If nums[mid] equals target, return mid.','If nums[mid] is less than target, search right half.','Otherwise search left half.','Return -1 if not found.'
],`def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`,['I use left and right boundaries for the active search range.','I check the middle value.','If it matches target, I return the index.','If the middle is too small, the target can only be on the right.','If too large, it can only be on the left.','If the range becomes empty, the target does not exist.'],['nums=[-1,0,3,5,9,12], target=9 -> 4','target=2 -> -1','[] -> -1'],'Time O(log n), space O(1).',['Why binary search? Sorted input allows eliminating half each step.','Why left <= right? It allows checking the final remaining element.'],['binary search','sorted array','return index']),

sol('merge-intervals','Merge Intervals — End-to-End Solution','Intervals','Overlapping ranges become easy to merge after sorting by start time.','Compare every interval to every other interval, messy and inefficient.',[
'Sort intervals by start.','Create merged list.','For each interval, if merged is empty or no overlap, append it.','Otherwise update the last interval end to max end.','Return merged.'
],`def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []

    for start, end in intervals:
        if not merged or start > merged[-1][1]:
            merged.append([start, end])
        else:
            merged[-1][1] = max(merged[-1][1], end)

    return merged`,['I sort by start time so overlapping intervals become adjacent.','The merged list stores the result so far.','If there is no previous interval or no overlap, I append the current interval.','If there is overlap, I extend the previous interval end if needed.','At the end, merged contains non-overlapping intervals.'],['[[1,3],[2,6],[8,10],[15,18]] -> [[1,6],[8,10],[15,18]]','[[1,4],[4,5]] -> [[1,5]]'],'Time O(n log n) due to sorting, space O(n) for result.',['Why sort first? It makes overlaps local/adjacent.','Why compare with merged[-1]? That is the last active merged range.'],['merge intervals','overlapping intervals'])
];

function norm(s){return (s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();}
function esc(s){return String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function list(items){return (items||[]).map(x=>`<li>${esc(x)}</li>`).join('');}
function copyText(t){navigator.clipboard.writeText(t||'');}
function renderSamples(){document.getElementById('samples').innerHTML=SAMPLES.map(([id,title,text])=>`<button class="templateBtn" onclick="loadSample('${id}')"><b>${esc(title)}</b><span>${esc(text.slice(0,82))}...</span></button>`).join('');}
function loadSample(id){const s=SAMPLES.find(x=>x[0]===id);document.getElementById('problem').value=s[2]; analyze();}
function detectExact(problem){const p=norm(problem);let best=null;for(const item of LIB){let score=0; for(const a of [item.id.replace(/-/g,' '), item.title.toLowerCase(), ...item.aliases]){const na=norm(a); if(na && p.includes(na)) score+=60;} for(const word of item.title.toLowerCase().split(/\W+/).filter(w=>w.length>3)){if(p.includes(word)) score+=8;} if(!best||score>best.score) best={item,score};} return best&&best.score>=45?best:null;}
function detectPattern(problem){const p=norm(problem);let scores=Object.entries(PATTERNS).map(([key,pat])=>{const hits=pat.words.filter(w=>p.includes(norm(w))); return {key, name:pat.name, why:pat.why, hits, score:Math.min(95,25+hits.length*15)};}).sort((a,b)=>b.score-a.score); return scores[0];}
function genericSolution(pattern, problem){
 const map={
 'Hash Map / Set': LIB.find(x=>x.id==='contains-duplicate'),
 'Two Pointers': LIB.find(x=>x.id==='valid-palindrome'),
 'Sliding Window': LIB.find(x=>x.id==='longest-substring'),
 'Stack': LIB.find(x=>x.id==='valid-parentheses'),
 'Tree / Graph Traversal': LIB.find(x=>x.id==='number-islands'),
 'Binary Search': LIB.find(x=>x.id==='binary-search'),
 'Intervals': LIB.find(x=>x.id==='merge-intervals'),
 'Prefix / Suffix': LIB.find(x=>x.id==='product-except-self')
 };
 const base=map[pattern.name]||LIB[0];
 return {...base,title:`Generic ${pattern.name} Route — Adapt to Exact Prompt`,why:pattern.why,confidenceNote:'Pattern fallback: use this route immediately, then adapt return value/condition to prompt wording.'};
}
function solve(problem){const exact=detectExact(problem); if(exact) return {...exact.item, mode:'EXACT LOCAL', confidence:Math.min(99,exact.score), signals: exact.item.aliases}; const pat=detectPattern(problem); return {...genericSolution(pat,problem), mode:'PATTERN LOCAL', confidence:pat.score, signals:pat.hits};}
function codexPrompt(problem){return `AI assistance is allowed. Give me a complete end-to-end DSA interview solution for this problem:\n\n${problem}\n\nReturn: pattern, why, clarifying questions, brute force, optimized steps, full Python code, line-by-line narration while coding, tests, complexity, and challenge answers. Keep it simple and speakable.`;}
function analyze(){const problem=document.getElementById('problem').value.trim(); if(!problem){clearAll();return;} showAiLoading(problem); smartTailor(problem);}
function showAiLoading(problem){window.lastPrompt=codexPrompt(problem);document.getElementById('output').innerHTML=`
<div class="sourceBanner aiSource"><div><b>🧠 Source: AI Smart Solver</b><p>Asking Groot/Hermes on the VPS for a tailored answer first. If the Hermes brain is unavailable or too slow, I will clearly switch to Instant Engine fallback.</p></div><div class="spinner">Thinking…</div></div>
<div class="sections">
  <div class="sec good"><h3>What is happening now?</h3><p>The app is not showing the generic instant answer yet. It is waiting for the AI response first so the final answer can be tailored to the exact question you pasted.</p></div>
  <div class="sec ai-box"><h3>Fallback safety</h3><p>If AI fails, the app will display a large <b>Source: Instant Engine Fallback</b> banner so you know at a glance the answer came from the local pattern engine.</p></div>
</div>`;}
function render(r, problem){window.lastPrompt=codexPrompt(problem);const isAi=(r.mode||'').includes('SMART AI');const sourceTitle=isAi?'🧠 Source: AI Smart Solver':'⚡ Source: Instant Engine Fallback';const sourceText=isAi?'This answer was generated by the configured AI model and tailored to the exact pasted question.':'AI did not return a usable answer, so this came from the local embedded pattern engine. Treat it as a fallback route, not a fully intelligent tailored answer.';const conf=Number.isFinite(Number(r.confidence))?`${esc(r.confidence)}%`:esc(r.confidence||'tailored');document.getElementById('output').innerHTML=`
<div class="sourceBanner ${isAi?'aiSource':'fallbackSource'}"><div><b>${sourceTitle}</b><p>${sourceText}</p></div><div class="sourcePill">${esc(r.mode)}</div></div>
<div class="result-head"><div class="metric"><div class="small">Solution</div><div class="big">${esc(r.title)}</div><div class="hint">${esc(r.confidenceNote||'Instant local solution from embedded pattern library')}</div></div><div class="metric"><div class="small">Pattern</div><div class="big">${esc(r.pattern)}</div><div class="hint">Signals: ${(r.signals||[]).map(esc).join(', ')||'pattern words'}</div></div><div class="metric"><div class="small">Mode</div><div class="big confidence">${esc(r.mode)}</div><div class="hint">Confidence: ${conf}</div></div></div>
<div class="sections">
<div class="sec good"><h3>🎙️ Opening script</h3><p>Let me restate the problem first. I believe this is a <b>${esc(r.pattern)}</b> problem. I’ll first explain the brute-force approach, then implement the optimized solution, test edge cases, and explain time and space complexity.</p></div>
<div class="sec"><h3>🧩 Why this pattern fits</h3><p>${esc(r.why)}</p></div>
<div class="sec"><h3>❓ Clarifying questions</h3><ul>${list(['Can the input be empty?','Should I return values, indices, a count, a boolean, or a modified structure?','Are duplicates, negative numbers, or special characters allowed?','Is the input sorted, and am I allowed to mutate it?','What should I return if there is no valid answer?'])}</ul></div>
<div class="sec"><h3>🐢 Brute force</h3><p>${esc(r.brute)}</p></div>
<div class="sec"><h3>🚀 Execution steps</h3><ol>${list(r.steps)}</ol></div>
<div class="sec ai-box"><h3>💻 Full code to write <button class="copy" onclick="copyText(document.getElementById('codeBlock').innerText)">Copy code</button></h3><div id="codeBlock" class="code">${esc(r.code)}</div></div>
<div class="sec"><h3>🗣️ What to say while coding</h3><ol>${list(r.lines)}</ol></div>
<div class="sec"><h3>🧪 Manual tests</h3><ul>${list(r.tests)}</ul></div>
<div class="sec"><h3>⏱️ Complexity</h3><p>${esc(r.complexity)}</p></div>
<div class="sec"><h3>🛡️ If interviewer challenges you</h3><ul>${list(r.challenges)}</ul></div>
<div class="sec good" id="smartStatus"><h3>🧠 Source status</h3><p>The top banner tells you whether this answer came from AI Smart Solver or Instant Engine fallback.</p></div>
<div class="sec ai-box"><h3>🤖 Optional Codex prompt <button class="copy" onclick="copyCodexPrompt()">Copy prompt</button></h3><div class="code">${esc(window.lastPrompt)}</div></div>
<div class="sec danger"><h3>⚠️ Source rule</h3><p>The app tries AI first. If AI fails, times out, or is not configured, it switches to Instant Engine fallback and shows a clear source banner at the top.</p></div>
</div>`;}
function normalizeSmart(data){return {title:data.title||'AI-Tailored DSA Solution', pattern:data.pattern||'Detected by AI', mode:'SMART AI', confidence: data.model_used || 'tailored', confidenceNote:data.confidence_note||'Question-specific solution generated by fast AI mode', signals:[data.model_used||'AI'], why:data.why_pattern||'', brute:data.brute_force||'', steps:data.optimized_steps||[], code:data.code||'', lines:data.line_by_line||[], tests:data.tests||[], complexity:data.complexity||'', challenges:data.challenge_answers||[]};}
function fallbackResult(problem, reason){const r=solve(problem);return {...r,mode:'INSTANT FALLBACK',confidenceNote:reason||'AI did not return a usable tailored answer, so this is from the local pattern engine.'};}
async function smartTailor(problem){
  try{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(), 70000);
    const res=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({problem}),signal:controller.signal});
    clearTimeout(timeout);
    if(!res.ok) throw new Error('server returned '+res.status);
    const data=await res.json();
    if(data.mode==='ai' && data.code && !data._ai_error){
      render(normalizeSmart(data), problem);
      const newStatus=document.getElementById('smartStatus');
      if(newStatus) newStatus.innerHTML='<h3>🧠 Smart AI source confirmed</h3><p class="match">This answer came from the configured AI model and is tailored to the exact pasted question.</p>';
    }else{
      const reason=data.ai_error?('Fallback reason: '+data.ai_error):'Fallback reason: AI provider is not configured yet or returned no tailored answer.';
      render(fallbackResult(problem, reason), problem);
      const newStatus=document.getElementById('smartStatus');
      if(newStatus) newStatus.innerHTML='<h3>⚡ Instant Engine fallback used</h3><p class="warnText">'+esc(reason)+'</p>';
    }
  }catch(e){
    render(fallbackResult(problem, 'Fallback reason: AI request failed or timed out: '+e.message), problem);
    const newStatus=document.getElementById('smartStatus');
    if(newStatus) newStatus.innerHTML='<h3>⚡ Instant Engine fallback used</h3><p class="warnText">AI request failed or timed out, so this answer came from the local engine.</p>';
  }
}
function clearAll(){document.getElementById('problem').value='';document.getElementById('output').innerHTML='<div class="pillbar"><span class="pill">AI smart solver</span><span class="pill">Instant fallback</span><span class="pill">Full code</span><span class="pill">Speaking script</span><span class="pill">Challenge defense</span></div><p class="hint">Paste a question or click a sample. The app asks AI first; fallback answers are clearly labeled.</p>';}
function copyCodexPrompt(){const p=window.lastPrompt||codexPrompt(document.getElementById('problem').value.trim()); if(!document.getElementById('problem').value.trim()){alert('Paste a problem first.');return;} navigator.clipboard.writeText(p);}
renderSamples();
